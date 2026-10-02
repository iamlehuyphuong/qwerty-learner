import { auth } from '@/lib/firebase'
import { fetchCloudDailyStats } from '@/lib/syncWordRecords'
import { db } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { Activity } from 'react-activity-calendar'

interface IWordStats {
  isEmpty?: boolean
  exerciseRecord: Activity[]
  wordRecord: Activity[]
  wpmRecord: [string, number][]
  accuracyRecord: [string, number][]
  wrongTimeRecord: { name: string; value: number }[]
}

// Nhận tất cả các ngày giữa hai ngày，sử dụngdayjstính toán
function getDatesBetween(start: number, end: number) {
  const dates = []
  let curr = dayjs(start).startOf('day')
  const last = dayjs(end).endOf('day')

  while (curr.diff(last) < 0) {
    dates.push(curr.clone().format('YYYY-MM-DD'))
    curr = curr.add(1, 'day')
  }

  return dates
}

function getLevel(value: number) {
  if (value === 0) return 0
  else if (value < 4) return 1
  else if (value < 8) return 2
  else if (value < 12) return 3
  else return 4
}

export function useWordStats(startTimeStamp: number, endTimeStamp: number) {
  const [wordStats, setWordStats] = useState<IWordStats>({
    isEmpty: true,
    exerciseRecord: [],
    wordRecord: [],
    wpmRecord: [],
    accuracyRecord: [],
    wrongTimeRecord: [],
  })

  useEffect(() => {
    const fetchWordStats = async () => {
      const stats = await getChapterStats(startTimeStamp, endTimeStamp)
      setWordStats(stats)
    }

    fetchWordStats()
  }, [startTimeStamp, endTimeStamp])

  return wordStats
}

async function getChapterStats(startTimeStamp: number, endTimeStamp: number): Promise<IWordStats> {
  // indexedDBTìm dữ liệu trong một dãy số
  const records: IWordRecord[] = await db.wordRecords.where('timeStamp').between(startTimeStamp, endTimeStamp).toArray()

  let data: {
    [x: string]: {
      exerciseTime: number
      words: string[]
      totalTime: number
      wrongCount: number
      wrongKeys: string[]
    }
  } = {}

  const dates = getDatesBetween(startTimeStamp * 1000, endTimeStamp * 1000)
  data = dates
    .map((date) => ({ [date]: { exerciseTime: 0, words: [], totalTime: 0, wrongCount: 0, wrongKeys: [] } }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})

  if (records.length === 0) {
    // Thử đọc từ cloud dailyStats
    const user = auth.currentUser
    if (user) {
      const startStr = dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
      const endStr = dayjs(endTimeStamp * 1000).format('YYYY-MM-DD')
      try {
        const cloudStats = await fetchCloudDailyStats(user.uid, startStr, endStr)
        if (cloudStats && cloudStats.length > 0) {
          cloudStats.forEach((stat) => {
            const date = stat.date
            if (data[date]) {
              data[date].exerciseTime = stat.exerciseCount || 0
              // dailyStats không lưu raw words array nữa, dùng totalWordCount
              // Tạo fake words array cho tính toán tương thích
              const wordCount = stat.totalWordCount || 0
              data[date].words = Array(wordCount).fill('_')
              data[date].totalTime = stat.totalTimeMs || 0
              data[date].wrongCount = stat.wrongCount || 0
              // wrongKeys in dailyStats is a map: { "A": 5, "B": 2 }
              const keys: string[] = []
              if (stat.wrongKeys) {
                Object.entries(stat.wrongKeys).forEach(([key, count]) => {
                  for (let i = 0; i < (count as number); i++) {
                    keys.push(key)
                  }
                })
              }
              data[date].wrongKeys = keys
            }
          })

          return computeStatsFromData(data)
        }
      } catch (e) {
        console.error('Failed to fetch cloud daily stats:', e)
      }
    }

    return { isEmpty: true, exerciseRecord: [], wordRecord: [], wpmRecord: [], accuracyRecord: [], wrongTimeRecord: [] }
  }

  for (let i = 0; i < records.length; i++) {
    const date = dayjs(records[i].timeStamp * 1000).format('YYYY-MM-DD')

    if (!data[date]) {
      data[date] = { exerciseTime: 0, words: [], totalTime: 0, wrongCount: 0, wrongKeys: [] }
    }

    data[date].exerciseTime = data[date].exerciseTime + 1
    data[date].words = [...data[date].words, records[i].word || '']
    data[date].totalTime = data[date].totalTime + (records[i].timing || []).reduce((acc, curr) => acc + curr, 0)
    data[date].wrongCount = data[date].wrongCount + (records[i].wrongCount || 0)
    data[date].wrongKeys = [...(data[date].wrongKeys || []), ...(Object.values(records[i].mistakes || {}).flat() || [])]
  }
  return computeStatsFromData(data)
}

function computeStatsFromData(data: any): IWordStats {
  const RecordArray = Object.entries(data) as any[]

  // Thực hành thống kê số đếm
  const exerciseRecord: IWordStats['exerciseRecord'] = RecordArray.map(([date, { exerciseTime }]) => ({
    date,
    count: exerciseTime,
    level: getLevel(exerciseTime),
  }))
  // Luyện tập đếm từ（Xóa trùng lặp）
  const wordRecord: IWordStats['wordRecord'] = RecordArray.map(([date, { words }]) => ({
    date,
    count: Array.from(new Set(words)).length,
    level: getLevel(Array.from(new Set(words)).length),
  }))
  // wpm=luyện tập đếm từ（Đừng loại bỏ trọng lượng）/tổng thời gian
  const wpmRecord: IWordStats['wpmRecord'] = RecordArray.map<[string, number]>(([date, { words, totalTime }]) => [
    date,
    Math.round(words.length / (totalTime / 1000 / 60)),
  ]).filter((d) => d[1])
  // Tỷ lệ chính xác=Tổng độ dài của mỗi từ/(Tổng độ dài của mỗi từ+Tổng số lỗi)
  const accuracyRecord: IWordStats['accuracyRecord'] = RecordArray.map<[string, number]>(([date, { words, wrongCount }]) => {
    const wordLength = words.join('').length
    if (wordLength === 0) return [date, 0]
    return [date, Math.round((wordLength / (wordLength + wrongCount)) * 100)]
  }).filter((d) => d[1])

  // Thống kê lỗi
  const wrongTimeRecord: IWordStats['wrongTimeRecord'] = []
  const allWrongTime = RecordArray.map(([, { wrongKeys }]) => wrongKeys)
    .flat()
    .filter(Boolean)
    .map((key) => key.toUpperCase())
  allWrongTime.forEach((key) => {
    const index = wrongTimeRecord.findIndex((item) => item.name === key)
    if (index === -1) {
      wrongTimeRecord.push({ name: key, value: 1 })
    } else {
      wrongTimeRecord[index].value++
    }
  })

  // Nếu tất cả các ngày đều không có practice
  const isEmpty = exerciseRecord.every((r) => r.count === 0)

  return { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord }
}
