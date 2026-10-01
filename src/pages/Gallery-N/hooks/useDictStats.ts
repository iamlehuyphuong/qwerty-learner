import { cloudChapterProgressAtom } from '@/store'
import { db } from '@/utils/db'
import type { IChapterRecord } from '@/utils/db/record'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

export function useDictStats(dictID: string, isStartLoad: boolean) {
  const [localChapters, setLocalChapters] = useState<number[] | null>(null)
  const cloudChapterProgress = useAtomValue(cloudChapterProgressAtom)

  useEffect(() => {
    const fetchLocalChapters = async () => {
      const chapters = await getExercisedChapters(dictID)
      setLocalChapters(chapters)
    }

    if (isStartLoad && !localChapters) {
      fetchLocalChapters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID, isStartLoad])

  // Gộp dữ liệu trên máy (IndexedDB) với tiến độ trên cloud để đăng nhập máy khác vẫn thấy đúng
  const dictStats = useMemo<IDictStats | null>(() => {
    if (!localChapters) return null
    const chapters = new Set(localChapters)
    Object.values(cloudChapterProgress).forEach(({ dictId, chapter }) => {
      if (dictId === dictID) chapters.add(chapter)
    })
    return { exercisedChapterCount: chapters.size }
  }, [localChapters, cloudChapterProgress, dictID])

  return dictStats
}

interface IDictStats {
  exercisedChapterCount: number
}

async function getExercisedChapters(dict: string): Promise<number[]> {
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict }).toArray()
  const allChapter = records.map(({ chapter }) => chapter).filter((item) => item !== null && item >= 0) as number[]
  return Array.from(new Set(allChapter))
}
