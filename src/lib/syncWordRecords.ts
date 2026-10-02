import { db } from '@/lib/firebase'
import { db as localDb } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import { WordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import type { FirestoreError } from 'firebase/firestore'
import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
  writeBatch,
} from 'firebase/firestore'

/**
 * Đồng bộ lịch sử luyện tập từng từ với Firestore.
 *
 * users/{uid}/wordRecords/{recordId}   mỗi lượt gõ một từ, chỉ tạo mới (rules cấm sửa) để đẩy lại không bị trùng
 * users/{uid}/dailyStats/{YYYY-MM-DD}  tổng hợp theo ngày cho trang Analysis (gộp mọi thiết bị)
 *
 * Bản ghi trên máy (IndexedDB) có `syncedUid` = tài khoản đã nhận bản ghi đó. Bản ghi chưa có `syncedUid`
 * (luyện tập khi chưa đăng nhập, hoặc đẩy lên thất bại) sẽ được đẩy lên tài khoản đăng nhập kế tiếp.
 */

type LocalWordRecord = IWordRecord & { id?: number }

export type CloudDailyStats = {
  date: string
  exerciseCount: number
  totalTimeMs: number
  wrongCount: number
  totalChars: number
  words: string[]
  wrongKeys: Record<string, number>
}

// Mỗi batch gồm bản ghi + dailyStats của chính các bản ghi đó (tối đa 2 * 200 < 500 thao tác),
// nên số liệu theo ngày luôn khớp với bản ghi dù batch nào thất bại
const RECORDS_PER_BATCH = 200
// Giới hạn của toán tử `in` trong Firestore
const MAX_IN_QUERY = 30
const PULL_PAGE_SIZE = 500
// Lùi mốc tải về một chút để không sót bản ghi có syncedAt sớm hơn nhưng commit muộn hơn
const PULL_OVERLAP_MS = 60 * 1000

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

// Loại bỏ undefined values (Firestore không chấp nhận undefined)
const toFirestoreValue = <T>(value: T): T => JSON.parse(JSON.stringify(value))

// FNV-1a 32-bit, đủ để phân biệt các lượt gõ trong cùng một giây
function hashString(input: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

/**
 * ID trên cloud tính từ nội dung bản ghi (không dùng id tự tăng của IndexedDB vì mỗi máy đánh số riêng),
 * nên cùng một lượt gõ luôn có cùng ID dù đẩy từ máy nào, import lại hay đẩy lại bao nhiêu lần.
 */
export function wordRecordDocId(record: Pick<IWordRecord, 'timeStamp' | 'dict' | 'word' | 'timing'>) {
  return `${record.timeStamp}_${hashString(`${record.dict}|${record.word}|${record.timing.join(',')}`)}`
}

function mistakeKeys(record: IWordRecord) {
  return Object.values(record.mistakes || {})
    .flat()
    .filter(Boolean)
    .map((k) => String(k).toUpperCase())
}

function toCloudWordRecord(record: IWordRecord) {
  return {
    ...toFirestoreValue({
      word: record.word,
      dict: record.dict,
      chapter: record.chapter ?? null,
      timeStamp: record.timeStamp,
      timing: record.timing,
      wrongCount: record.wrongCount,
      mistakes: record.mistakes || {},
    }),
    hasError: record.wrongCount > 0,
    syncedAt: serverTimestamp(),
  }
}

function buildDailyStatsUpdates(records: IWordRecord[]) {
  const groups: Record<
    string,
    { count: number; totalTimeMs: number; wrongCount: number; totalChars: number; words: Set<string>; wrongKeys: Record<string, number> }
  > = {}

  for (const record of records) {
    const date = dayjs(record.timeStamp * 1000).format('YYYY-MM-DD')
    const group = (groups[date] ??= { count: 0, totalTimeMs: 0, wrongCount: 0, totalChars: 0, words: new Set(), wrongKeys: {} })
    group.count += 1
    group.totalTimeMs += record.timing.reduce((acc, curr) => acc + curr, 0)
    group.wrongCount += record.wrongCount
    group.totalChars += record.word.length
    group.words.add(record.word)
    for (const key of mistakeKeys(record)) {
      group.wrongKeys[key] = (group.wrongKeys[key] || 0) + 1
    }
  }

  return Object.entries(groups).map(([date, group]) => ({
    date,
    // setDoc không hiểu dấu chấm trong tên field ('wrongKeys.A' sẽ thành field tên đúng như vậy),
    // phải dùng object lồng nhau để merge vào map wrongKeys
    data: {
      date,
      exerciseCount: increment(group.count),
      totalTimeMs: increment(group.totalTimeMs),
      wrongCount: increment(group.wrongCount),
      totalChars: increment(group.totalChars),
      words: arrayUnion(...Array.from(group.words)),
      wrongKeys: Object.fromEntries(Object.entries(group.wrongKeys).map(([key, count]) => [key, increment(count)])),
      updatedAt: serverTimestamp(),
    },
  }))
}

async function commitRecords(uid: string, records: LocalWordRecord[]) {
  const batch = writeBatch(db)
  for (const record of records) {
    // set không merge: tạo mới, rules cấm ghi đè bản ghi đã có
    batch.set(doc(db, 'users', uid, 'wordRecords', wordRecordDocId(record)), toCloudWordRecord(record))
  }
  for (const { date, data } of buildDailyStatsUpdates(records)) {
    batch.set(doc(db, 'users', uid, 'dailyStats', date), data, { merge: true })
  }
  await batch.commit()
}

async function markSynced(uid: string, records: LocalWordRecord[]) {
  const ids = records.map((r) => r.id).filter((id): id is number => id !== undefined)
  if (ids.length === 0) return
  await localDb.wordRecords.where(':id').anyOf(ids).modify({ syncedUid: uid })
}

async function findExistingDocIds(uid: string, docIds: string[]) {
  const existing = new Set<string>()
  for (const ids of chunkArray(docIds, MAX_IN_QUERY)) {
    const snapshot = await getDocs(query(collection(db, 'users', uid, 'wordRecords'), where(documentId(), 'in', ids)))
    snapshot.forEach((d) => existing.add(d.id))
  }
  return existing
}

const isPermissionDenied = (error: unknown) => (error as FirestoreError)?.code === 'permission-denied'

async function syncChunk(uid: string, records: LocalWordRecord[]) {
  try {
    await commitRecords(uid, records)
    await markSynced(uid, records)
    return
  } catch (error) {
    // Lỗi mạng: giữ nguyên để lần sau đẩy lại
    if (!isPermissionDenied(error)) throw error
  }

  // Bị từ chối thường do có bản ghi đã tồn tại trên cloud (máy/tab khác đã đẩy): bỏ các bản ghi đó rồi đẩy lại
  const existing = await findExistingDocIds(
    uid,
    records.map((r) => wordRecordDocId(r)),
  )
  const alreadySynced = records.filter((r) => existing.has(wordRecordDocId(r)))
  const remaining = records.filter((r) => !existing.has(wordRecordDocId(r)))
  await markSynced(uid, alreadySynced)
  if (remaining.length === 0) return

  try {
    await commitRecords(uid, remaining)
    await markSynced(uid, remaining)
    return
  } catch (error) {
    if (!isPermissionDenied(error)) throw error
  }

  // Vẫn bị từ chối: có bản ghi dữ liệu không hợp lệ. Đẩy từng bản ghi để bản ghi hỏng không chặn cả hàng đợi
  for (const record of remaining) {
    try {
      await commitRecords(uid, [record])
    } catch (error) {
      if (!isPermissionDenied(error)) throw error
      console.warn('Firebase: Bỏ qua bản ghi không hợp lệ:', record, error)
    }
    // Đánh dấu cả bản ghi hỏng để không thử lại mãi
    await markSynced(uid, [record])
  }
}

let syncInFlight: Promise<void> | null = null

/**
 * Đẩy các bản ghi trên máy chưa đồng bộ lên tài khoản `uid`.
 * Gọi khi hoàn thành một bài, khi đăng nhập, khi có mạng trở lại và trước khi đăng xuất.
 */
export function syncPendingWordRecords(uid: string): Promise<void> {
  if (syncInFlight) {
    // Đang đẩy: chờ xong rồi đẩy tiếp các bản ghi mới phát sinh trong lúc chờ
    return syncInFlight.then(() => syncPendingWordRecords(uid))
  }

  syncInFlight = (async () => {
    const pending: LocalWordRecord[] = await localDb.wordRecords.filter((r) => !r.syncedUid).toArray()
    if (pending.length === 0) return
    for (const records of chunkArray(pending, RECORDS_PER_BATCH)) {
      await syncChunk(uid, records)
    }
    console.log(`Firebase: Đã đồng bộ ${pending.length} bản ghi từ.`)
  })().finally(() => {
    syncInFlight = null
  })

  return syncInFlight
}

export function countPendingWordRecords() {
  return localDb.wordRecords.filter((r) => !r.syncedUid).count()
}

const pullCursorKey = (uid: string) => `wordRecordsPulledAt:${uid}`

/**
 * Tải các từ gõ sai do máy khác đẩy lên về IndexedDB (cho Error Book / ôn tập từ sai).
 * Chỉ tải phần mới kể từ lần trước. Bản ghi tải về có `fromCloud` nên không bị tính trùng trong thống kê.
 */
export async function pullCloudWordRecords(uid: string) {
  let cursor = 0
  try {
    cursor = Number(localStorage.getItem(pullCursorKey(uid))) || 0
  } catch {
    // localStorage không khả dụng: tải lại từ đầu
  }

  const since = Timestamp.fromMillis(Math.max(0, cursor - PULL_OVERLAP_MS))
  const cloudRecords: IWordRecord[] = []
  let maxSyncedAt = cursor
  let lastDoc = undefined as Parameters<typeof startAfter>[0] | undefined

  for (;;) {
    const constraints = [where('hasError', '==', true), where('syncedAt', '>', since), orderBy('syncedAt'), limit(PULL_PAGE_SIZE)]
    const q = lastDoc
      ? query(collection(db, 'users', uid, 'wordRecords'), ...constraints, startAfter(lastDoc))
      : query(collection(db, 'users', uid, 'wordRecords'), ...constraints)
    const snapshot = await getDocs(q)
    snapshot.forEach((d) => {
      const data = d.data()
      cloudRecords.push({
        word: data.word,
        dict: data.dict,
        chapter: data.chapter ?? null,
        timeStamp: data.timeStamp,
        timing: data.timing || [],
        wrongCount: data.wrongCount,
        mistakes: data.mistakes || {},
      })
      if (data.syncedAt instanceof Timestamp) maxSyncedAt = Math.max(maxSyncedAt, data.syncedAt.toMillis())
    })
    if (snapshot.size < PULL_PAGE_SIZE) break
    lastDoc = snapshot.docs[snapshot.docs.length - 1]
  }

  if (cloudRecords.length > 0) {
    const localRecords = await localDb.wordRecords.where('wrongCount').above(0).toArray()
    const localIds = new Set(localRecords.map((r) => wordRecordDocId(r)))
    const recordsToAdd = cloudRecords
      .filter((r) => !localIds.has(wordRecordDocId(r)))
      .map((r) => {
        const record = new WordRecord(r.word, r.dict, r.chapter, r.timing, r.wrongCount, r.mistakes)
        // constructor đặt timeStamp = hiện tại, trả lại giá trị gốc
        record.timeStamp = r.timeStamp
        record.syncedUid = uid
        record.fromCloud = true
        return record
      })

    if (recordsToAdd.length > 0) {
      await localDb.wordRecords.bulkAdd(recordsToAdd)
      console.log(`Firebase: Đã tải ${recordsToAdd.length} từ sai từ cloud.`)
    }
  }

  try {
    localStorage.setItem(pullCursorKey(uid), String(maxSyncedAt))
  } catch {
    // bỏ qua
  }
}

export async function fetchCloudDailyStats(uid: string, startStr: string, endStr: string): Promise<CloudDailyStats[]> {
  const q = query(collection(db, 'users', uid, 'dailyStats'), where('date', '>=', startStr), where('date', '<=', endStr))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => {
    const data = d.data()
    return {
      date: data.date,
      exerciseCount: data.exerciseCount || 0,
      totalTimeMs: data.totalTimeMs || 0,
      wrongCount: data.wrongCount || 0,
      totalChars: data.totalChars || 0,
      words: data.words || [],
      wrongKeys: data.wrongKeys || {},
    }
  })
}

export async function deleteCloudWordRecords(uid: string, word: string, dict: string) {
  const q = query(collection(db, 'users', uid, 'wordRecords'), where('word', '==', word), where('dict', '==', dict))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return

  for (const chunk of chunkArray(snapshot.docs, 450)) {
    const batch = writeBatch(db)
    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })
    await batch.commit()
  }

  console.log(`Deleted ${snapshot.size} word records for '${word}' from cloud.`)
}

/**
 * Đăng xuất: xoá khỏi máy dữ liệu luyện tập đã nằm trên cloud của tài khoản (đăng nhập lại sẽ tải về),
 * để chế độ khách / tài khoản khác dùng máy này không thấy. Bản ghi chưa đồng bộ được giữ lại.
 */
export async function clearLocalAccountData(uid: string) {
  await localDb.transaction('rw', localDb.wordRecords, localDb.chapterRecords, async () => {
    await localDb.wordRecords.filter((r) => r.syncedUid === uid).delete()
    await localDb.chapterRecords.filter((r) => r.uid === uid).delete()
  })
  try {
    localStorage.removeItem(pullCursorKey(uid))
  } catch {
    // bỏ qua
  }
}
