import { chapterProgressKey, recordChapterCompletion } from '@/lib/cloudSync'
import { auth, db } from '@/lib/firebase'
import type { TypingState } from '@/pages/Typing/store/type'
import { cloudChapterProgressAtom, currentChapterAtom, currentDictIdAtom, isReviewModeAtom } from '@/store'
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from 'firebase/firestore'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

export function useFirebaseChapterLogUploader() {
  const currentChapter = useAtomValue(currentChapterAtom)
  const isRevision = useAtomValue(isReviewModeAtom)
  const dictID = useAtomValue(currentDictIdAtom)
  const setCloudChapterProgress = useSetAtom(cloudChapterProgressAtom)

  const uploadLog = useCallback(
    async (typingState: TypingState) => {
      const user = auth.currentUser
      if (!user || !db) return

      try {
        const {
          chapterData: { correctCount, wrongCount, wordCount },
          timerData: { time, wpm, accuracy },
        } = typingState

        // timerData.time tính bằng giây
        const timeSpentMs = time * 1000
        const finalWpm = Number.isFinite(wpm) ? wpm : 0

        // 1. Add log to users/{uid}/history
        await addDoc(collection(db, 'users', user.uid, 'history'), {
          dictID,
          chapter: isRevision ? -1 : currentChapter,
          timeSpentMs,
          accuracy,
          correctCount,
          wrongCount,
          wordCount,
          wpm: finalWpm,
          isRevision,
          timestamp: serverTimestamp(),
        })

        // 2. Increment statistics in the parent user document
        const userRef = doc(db, 'users', user.uid)
        await setDoc(
          userRef,
          {
            totalTimeSpentMs: increment(timeSpentMs),
            totalChapters: increment(1),
            totalWords: increment(wordCount),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )

        // 3. Update per-chapter progress users/{uid}/chapterProgress/{dictId}__{chapter}
        if (!isRevision) {
          const progress = await recordChapterCompletion(user.uid, {
            dictId: dictID,
            chapter: currentChapter,
            timeSpentMs,
            wpm: finalWpm,
            accuracy,
            wrongCount,
          })
          setCloudChapterProgress((old) => ({ ...old, [chapterProgressKey(progress.dictId, progress.chapter)]: progress }))
        }

        console.log('Firebase: Uploaded usage history & updated stats successfully.')
      } catch (error) {
        console.error('Firebase: Error uploading log to Firebase:', error)
      }
    },
    [currentChapter, isRevision, dictID, setCloudChapterProgress],
  )

  return uploadLog
}
