import { db } from '@/lib/firebase'
import {
  fontSizeConfigAtom,
  hintSoundsConfigAtom,
  isIgnoreCaseAtom,
  isOpenDarkModeAtom,
  isShowAnswerOnHoverAtom,
  isShowHandPositionAtom,
  isShowPrevAndNextWordAtom,
  isTextSelectableAtom,
  keySoundsConfigAtom,
  loopWordConfigAtom,
  phoneticConfigAtom,
  pronunciationConfigAtom,
  randomConfigAtom,
  wordDictationConfigAtom,
} from '@/store'
import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore'

/**
 * Cấu trúc dữ liệu trên Firestore:
 *
 * users/{uid}
 *   settings: { [key in SyncedSettingKey]: value }   // cấu hình người dùng
 *   settingsUpdatedAt: Timestamp
 *   progress: { dictId, chapter, updatedAt }          // chương trình & bài đang học
 *
 * users/{uid}/chapterProgress/{dictId}__{chapter}     // tổng hợp mỗi bài đã hoàn thành
 * users/{uid}/history/{autoId}                        // log từng lần luyện tập
 */

// Các atom cấu hình được đồng bộ lên cloud. Key là tên field trong `users/{uid}.settings`
export const syncedSettingAtoms = {
  loopWordConfig: loopWordConfigAtom,
  keySoundsConfig: keySoundsConfigAtom,
  hintSoundsConfig: hintSoundsConfigAtom,
  pronunciation: pronunciationConfigAtom,
  fontSize: fontSizeConfigAtom,
  randomConfig: randomConfigAtom,
  phoneticConfig: phoneticConfigAtom,
  wordDictationConfig: wordDictationConfigAtom,
  isShowPrevAndNextWord: isShowPrevAndNextWordAtom,
  isIgnoreCase: isIgnoreCaseAtom,
  isShowAnswerOnHover: isShowAnswerOnHoverAtom,
  isTextSelectable: isTextSelectableAtom,
  isOpenDarkMode: isOpenDarkModeAtom,
  isShowHandPosition: isShowHandPositionAtom,
}

export type SyncedSettingKey = keyof typeof syncedSettingAtoms
export type CloudSettings = Partial<Record<SyncedSettingKey, unknown>>

export type CloudProgress = {
  dictId: string
  chapter: number
}

export type CloudChapterProgress = {
  dictId: string
  chapter: number
  completedCount: number
  totalTimeSpentMs: number
  bestWpm: number
  lastWpm: number
  lastAccuracy: number
  lastWrongCount: number
  firstCompletedAt: number
  lastCompletedAt: number
}

export type CloudChapterProgressMap = Record<string, CloudChapterProgress>

export type CloudState = {
  settings?: CloudSettings
  progress?: CloudProgress
  chapterProgress: CloudChapterProgressMap
}

export const chapterProgressKey = (dictId: string, chapter: number) => `${dictId.replace(/\//g, '_')}__${chapter}`

// Firestore không chấp nhận `undefined`, loại bỏ bằng JSON round-trip
const toFirestoreValue = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export async function fetchCloudState(uid: string): Promise<CloudState> {
  const [userSnap, progressSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDocs(collection(db, 'users', uid, 'chapterProgress')),
  ])

  const userData = userSnap.data()
  const chapterProgress: CloudChapterProgressMap = {}
  progressSnap.forEach((d) => {
    const data = d.data() as CloudChapterProgress
    chapterProgress[chapterProgressKey(data.dictId, data.chapter)] = data
  })

  const progress = userData?.progress
  return {
    settings: userData?.settings,
    progress:
      progress && typeof progress.dictId === 'string' ? { dictId: progress.dictId, chapter: Number(progress.chapter) || 0 } : undefined,
    chapterProgress,
  }
}

export async function pushSettings(uid: string, settings: CloudSettings) {
  await setDoc(doc(db, 'users', uid), { settings: toFirestoreValue(settings), settingsUpdatedAt: serverTimestamp() }, { merge: true })
}

export async function pushProgress(uid: string, progress: CloudProgress) {
  await setDoc(doc(db, 'users', uid), { progress: { ...progress, updatedAt: serverTimestamp() } }, { merge: true })
}

export async function recordChapterCompletion(
  uid: string,
  result: { dictId: string; chapter: number; timeSpentMs: number; wpm: number; accuracy: number; wrongCount: number },
): Promise<CloudChapterProgress> {
  const ref = doc(db, 'users', uid, 'chapterProgress', chapterProgressKey(result.dictId, result.chapter))

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    const prev = snap.exists() ? (snap.data() as CloudChapterProgress) : undefined
    const now = Date.now()

    const next: CloudChapterProgress = {
      dictId: result.dictId,
      chapter: result.chapter,
      completedCount: (prev?.completedCount ?? 0) + 1,
      totalTimeSpentMs: (prev?.totalTimeSpentMs ?? 0) + result.timeSpentMs,
      bestWpm: Math.max(prev?.bestWpm ?? 0, result.wpm),
      lastWpm: result.wpm,
      lastAccuracy: result.accuracy,
      lastWrongCount: result.wrongCount,
      firstCompletedAt: prev?.firstCompletedAt ?? now,
      lastCompletedAt: now,
    }
    tx.set(ref, next)
    return next
  })
}
