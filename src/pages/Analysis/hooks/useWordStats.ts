import type { CloudDailyStats } from '@/lib/syncWordRecords'
import { fetchCloudDailyStats } from '@/lib/syncWordRecords'
import { authUserAtom } from '@/store'
import { db } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
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
  const uid = useAtomValue(authUserAtom)?.uid
  const [wordStats, setWordStats] = useState<IWordStats>({
    isEmpty: true,
    exerciseRecord: [],
    wordRecord: [],
    wpmRecord: [],
    accuracyRecord: [],
    wrongTimeRecord: [],
  })

  useEffect(() => {
    let cancelled = false
    getChapterStats(startTimeStamp, endTimeStamp, uid).then((stats) => {
      if (!cancelled) setWordStats(stats)
    })
    return () => {
      cancelled = true
    }
  }, [startTimeStamp, endTimeStamp, uid])

  return wordStats
}

type DayData = {
  exerciseCount: number
  words: Set<string>
  totalChars: number
  totalTime: number
  wrongCount: number
  wrongKeys: Record<string, number>
}

const emptyDay = (): DayData => ({ exerciseCount: 0, words: new Set(), totalChars: 0, totalTime: 0, wrongCount: 0, wrongKeys: {} })

function addLocalRecord(data: Record<string, DayData>, record: IWordRecord) {
  const date = dayjs(record.timeStamp * 1000).format('YYYY-MM-DD')
  const day = (data[date] ??= emptyDay())
  day.exerciseCount += 1
  day.words.add(record.word || '')
  day.totalChars += (record.word || '').length
  day.totalTime += (record.timing || []).reduce((acc, curr) => acc + curr, 0)
  day.wrongCount += record.wrongCount || 0
  Object.values(record.mistakes || {})
    .flat()
    .filter(Boolean)
    .forEach((key) => {
      const k = String(key).toUpperCase()
      day.wrongKeys[k] = (day.wrongKeys[k] || 0) + 1
    })
}

function addCloudStats(data: Record<string, DayData>, stat: CloudDailyStats) {
  const day = (data[stat.date] ??= emptyDay())
  day.exerciseCount += stat.exerciseCount
  stat.words.forEach((word) => day.words.add(word))
  day.totalChars += stat.totalChars
  day.totalTime += stat.totalTimeMs
  day.wrongCount += stat.wrongCount
  Object.entries(stat.wrongKeys).forEach(([key, count]) => {
    day.wrongKeys[key] = (day.wrongKeys[key] || 0) + count
  })
}

/**
 * - Khách: thống kê từ toàn bộ bản ghi trên máy.
 * - Đã đăng nhập: dailyStats trên cloud (gộp mọi thiết bị, gồm cả phần máy này đã đẩy lên)
 *   + bản ghi trên máy chưa đồng bộ. Nếu không tải được cloud thì dùng bản ghi do máy này tạo.
 */
async function getChapterStats(startTimeStamp: number, endTimeStamp: number, uid: string | undefined): Promise<IWordStats> {
  // indexedDBTìm dữ liệu trong một dãy số
  const records: IWordRecord[] = await db.wordRecords.where('timeStamp').between(startTimeStamp, endTimeStamp).toArray()

  const data: Record<string, DayData> = {}
  getDatesBetween(startTimeStamp * 1000, endTimeStamp * 1000).forEach((date) => {
    data[date] = emptyDay()
  })

  let cloudStats: CloudDailyStats[] | null = null
  if (uid) {
    try {
      const startStr = dayjs(startTimeStamp * 1000).format('YYYY-MM-DD')
      const endStr = dayjs(endTimeStamp * 1000).format('YYYY-MM-DD')
      cloudStats = await fetchCloudDailyStats(uid, startStr, endStr)
    } catch (e) {
      console.error('Failed to fetch cloud daily stats:', e)
    }
  }

  if (cloudStats) {
    cloudStats.forEach((stat) => addCloudStats(data, stat))
    records.filter((r) => !r.syncedUid).forEach((r) => addLocalRecord(data, r))
  } else if (uid) {
    // Bản ghi tải từ cloud về chỉ gồm từ gõ sai, tính vào sẽ làm lệch thống kê
    records.filter((r) => !r.fromCloud).forEach((r) => addLocalRecord(data, r))
  } else {
    records.forEach((r) => addLocalRecord(data, r))
  }

  return computeStatsFromData(data)
}

function computeStatsFromData(data: Record<string, DayData>): IWordStats {
  const RecordArray = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))

  // Thực hành thống kê số đếm
  const exerciseRecord: IWordStats['exerciseRecord'] = RecordArray.map(([date, { exerciseCount }]) => ({
    date,
    count: exerciseCount,
    level: getLevel(exerciseCount),
  }))
  // Luyện tập đếm từ（Xóa trùng lặp）
  const wordRecord: IWordStats['wordRecord'] = RecordArray.map(([date, { words }]) => ({
    date,
    count: words.size,
    level: getLevel(words.size),
  }))
  // wpm=luyện tập đếm từ（Đừng loại bỏ trọng lượng）/tổng thời gian
  const wpmRecord: IWordStats['wpmRecord'] = RecordArray.map<[string, number]>(([date, { exerciseCount, totalTime }]) => [
    date,
    Math.round(exerciseCount / (totalTime / 1000 / 60)),
  ]).filter((d) => d[1])
  // Tỷ lệ chính xác=Tổng độ dài của mỗi từ/(Tổng độ dài của mỗi từ+Tổng số lỗi)
  const accuracyRecord: IWordStats['accuracyRecord'] = RecordArray.map<[string, number]>(([date, { totalChars, wrongCount }]) => {
    if (totalChars === 0) return [date, 0]
    return [date, Math.round((totalChars / (totalChars + wrongCount)) * 100)]
  }).filter((d) => d[1])

  // Thống kê lỗi
  const wrongKeyCount: Record<string, number> = {}
  RecordArray.forEach(([, { wrongKeys }]) => {
    Object.entries(wrongKeys).forEach(([key, count]) => {
      wrongKeyCount[key] = (wrongKeyCount[key] || 0) + count
    })
  })
  const wrongTimeRecord: IWordStats['wrongTimeRecord'] = Object.entries(wrongKeyCount).map(([name, value]) => ({ name, value }))

  // Nếu tất cả các ngày đều không có practice
  const isEmpty = exerciseRecord.every((r) => r.count === 0)

  return { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord }
}
