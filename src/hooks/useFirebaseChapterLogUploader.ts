import { auth, db } from '@/lib/firebase'
import type { TypingState } from '@/pages/Typing/store/type'
import { currentChapterAtom, currentDictIdAtom, isReviewModeAtom } from '@/store'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'

export function useFirebaseChapterLogUploader() {
  const currentChapter = useAtomValue(currentChapterAtom)
  const isRevision = useAtomValue(isReviewModeAtom)
  const dictID = useAtomValue(currentDictIdAtom)

  const uploadLog = useCallback(
    async (typingState: TypingState) => {
      const user = auth.currentUser
      if (!user || !db) return

      try {
        const {
          chapterData: { correctCount, wrongCount, wordCount },
          timerData: { time },
        } = typingState

        const wpm = (correctCount / (time / 1000 / 60)).toFixed(2)

        const finalWpm = isNaN(parseFloat(wpm)) ? 0 : parseFloat(wpm)

        // 1. Add log to users/{uid}/history
        await addDoc(collection(db, 'users', user.uid, 'history'), {
          dictID,
          chapter: isRevision ? -1 : currentChapter,
          timeSpentMs: time,
          correctCount,
          wrongCount,
          wordCount,
          wpm: finalWpm,
          isRevision,
          timestamp: serverTimestamp(),
        })

        // 2. Increment statistics in the parent user document
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          totalTimeSpentMs: increment(time),
          totalChapters: increment(1),
          totalWords: increment(wordCount),
          updatedAt: serverTimestamp(),
        })

        console.log('Firebase: Uploaded usage history & updated stats successfully.')
      } catch (error) {
        console.error('Firebase: Error uploading log to Firebase:', error)
      }
    },
    [currentChapter, isRevision, dictID],
  )

  return uploadLog
}
