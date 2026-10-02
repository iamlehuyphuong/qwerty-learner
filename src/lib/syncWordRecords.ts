import { db } from '@/lib/firebase'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { collection, doc, writeBatch, serverTimestamp, increment, getDocs, query, where } from 'firebase/firestore'

// Firestore writeBatch giới hạn 500 operations mỗi batch
const MAX_BATCH_OPS = 450

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

// Loại bỏ undefined values (Firestore không chấp nhận undefined)
const toFirestoreValue = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export async function pushWordRecordsBatch(uid: string, records: (IWordRecord & { localId: number })[]) {
  if (records.length === 0) return

  // 1. Tính daily stats aggregates trước
  const dailyGroups: Record<
    string,
    {
      exerciseCount: number
      words: string[]
      totalTimeMs: number
      wrongCount: number
      wrongKeys: Record<string, number>
    }
  > = {}

  for (const record of records) {
    const date = dayjs(record.timeStamp * 1000).format('YYYY-MM-DD')
    if (!dailyGroups[date]) {
      dailyGroups[date] = { exerciseCount: 0, words: [], totalTimeMs: 0, wrongCount: 0, wrongKeys: {} }
    }

    dailyGroups[date].exerciseCount += 1
    dailyGroups[date].words.push(record.word)
    dailyGroups[date].totalTimeMs += record.timing.reduce((acc, curr) => acc + curr, 0)
    dailyGroups[date].wrongCount += record.wrongCount

    const mistakes = Object.values(record.mistakes || {})
      .flat()
      .filter(Boolean)
      .map((k) => k.toUpperCase())
    for (const key of mistakes) {
      dailyGroups[date].wrongKeys[key] = (dailyGroups[date].wrongKeys[key] || 0) + 1
    }
  }

  // 2. Tổng hợp tất cả operations cần thực hiện
  type BatchOp = { type: 'set'; path: string; data: any }
  const ops: BatchOp[] = []

  // Word records — dùng localId làm doc ID để idempotent (không trùng khi retry)
  for (const record of records) {
    ops.push({
      type: 'set',
      path: `users/${uid}/wordRecords/local_${record.localId}`,
      data: toFirestoreValue({
        word: record.word,
        dict: record.dict,
        chapter: record.chapter,
        timeStamp: record.timeStamp,
        timing: record.timing,
        wrongCount: record.wrongCount,
        mistakes: record.mistakes,
        localId: record.localId,
        syncedAt: serverTimestamp(),
      }),
    })
  }

  // Daily stats — dùng increment cho concurrent-safe
  for (const [date, stats] of Object.entries(dailyGroups)) {
    // Tách thành 1 set operation cho mỗi ngày
    const updateData: Record<string, any> = {
      date,
      exerciseCount: increment(stats.exerciseCount),
      // totalWordCount: tổng lượt gõ (kể cả trùng) → dùng cho WPM
      totalWordCount: increment(stats.exerciseCount),
      // uniqueWords sẽ được tính từ words array khi đọc
      totalTimeMs: increment(stats.totalTimeMs),
      wrongCount: increment(stats.wrongCount),
      updatedAt: serverTimestamp(),
    }

    for (const [key, count] of Object.entries(stats.wrongKeys)) {
      updateData[`wrongKeys.${key}`] = increment(count)
    }

    ops.push({
      type: 'set',
      path: `users/${uid}/dailyStats/${date}`,
      data: updateData,
    })
  }

  // 3. Chia ops thành batches <= MAX_BATCH_OPS và commit
  const chunks = chunkArray(ops, MAX_BATCH_OPS)
  for (const chunk of chunks) {
    const batch = writeBatch(db)
    for (const op of chunk) {
      const ref = doc(db, op.path)
      batch.set(ref, op.data, { merge: true })
    }
    await batch.commit()
  }
}

/**
 * Fetch word records (wrongCount > 0) từ cloud và merge vào IndexedDB.
 * Analysis data được xử lý riêng qua dailyStats fallback, nên ở đây chỉ
 * cần sync các từ sai (Error-Book) là đủ.
 */
export async function fetchAndMergeCloudWordRecords(uid: string) {
  // Chỉ import dynamic để tránh circular dependency
  const { db: localDb } = await import('@/utils/db')
  const { WordRecord } = await import('@/utils/db/record')

  const q = query(collection(db, 'users', uid, 'wordRecords'), where('wrongCount', '>', 0))
  const snapshot = await getDocs(q)

  const cloudRecords = snapshot.docs.map((d) => d.data() as IWordRecord & { localId?: number })

  if (cloudRecords.length === 0) return

  // So sánh bằng composite key (word + dict + timeStamp) để tránh trùng
  const localRecords = await localDb.wordRecords.where('wrongCount').above(0).toArray()
  const localKeys = new Set(localRecords.map((r) => `${r.word}_${r.dict}_${r.timeStamp}`))

  const recordsToAdd = cloudRecords.filter((r) => !localKeys.has(`${r.word}_${r.dict}_${r.timeStamp}`))

  if (recordsToAdd.length > 0) {
    const wordRecordsToInsert = recordsToAdd.map((r) => new WordRecord(r.word, r.dict, r.chapter, r.timing, r.wrongCount, r.mistakes))
    // Fix timeStamp back to original since constructor overwrites it
    recordsToAdd.forEach((r, i) => {
      wordRecordsToInsert[i].timeStamp = r.timeStamp
    })

    await localDb.wordRecords.bulkAdd(wordRecordsToInsert)
    console.log(`Merged ${recordsToAdd.length} cloud word records into local IndexedDB.`)
  }
}

export async function fetchCloudDailyStats(uid: string, startStr: string, endStr: string) {
  const q = query(collection(db, 'users', uid, 'dailyStats'), where('date', '>=', startStr), where('date', '<=', endStr))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => d.data())
}

export async function deleteCloudWordRecords(uid: string, word: string, dict: string) {
  const q = query(collection(db, 'users', uid, 'wordRecords'), where('word', '==', word), where('dict', '==', dict))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return

  // Cũng cần chia batch nếu có nhiều records
  const chunks = chunkArray(snapshot.docs, MAX_BATCH_OPS)
  for (const chunk of chunks) {
    const batch = writeBatch(db)
    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })
    await batch.commit()
  }

  console.log(`Deleted ${snapshot.size} word records for '${word}' from cloud.`)
}
