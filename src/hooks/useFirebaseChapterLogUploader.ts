import { chapterProgressKey, recordChapterCompletion } from '@/lib/cloudSync'
import { auth, db } from '@/lib/firebase'
import { syncPendingWordRecords } from '@/lib/syncWordRecords'
import type { TypingState } from '@/pages/Typing/store/type'
import { cloudChapterProgressAtom, currentChapterAtom, currentDictIdAtom, isReviewModeAtom } from '@/store'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
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

      // Đẩy các bản ghi từ chưa đồng bộ (bài vừa xong, các bài trước đó đẩy lỗi, lúc chưa đăng nhập).
      // Chạy độc lập để lỗi ở các bước dưới không chặn việc đồng bộ lịch sử
      syncPendingWordRecords(user.uid).catch((error) => console.error('Firebase: Error syncing word records:', error))

      try {
        const {
          chapterData: { correctCount, wrongCount, wordCount },
          timerData: { time, wpm, accuracy },
        } = typingState

        // timerData.time tính bằng giây
        const timeSpentMs = time * 1000
        const finalWpm = Number.isFinite(wpm) ? wpm : 0

        // 1. Add log to users/{uid}/history
        // Server (functions: onHistoryCreated) tính streak và thống kê tổng từ log này
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

        // 2. Update per-chapter progress users/{uid}/chapterProgress/{dictId}__{chapter}
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
