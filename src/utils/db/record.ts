import { getUTCUnixTimestamp } from '../index'
import type { Word } from '@/typings'

export interface IWordRecord {
  word: string
  timeStamp: number
  // 正常chươngvì dictKey, 其他功能则vì对应của类型
  dict: string
  // Người dùng có thể ở Câu hỏi sai/Trong số các thành phần tương tự khác 进行củaluyện tập则vì null, start from 0
  chapter: number | null
  // Thời gian chính xác中输入每个字母củathời gian差，可以据此tính toán出tổng thời gian
  timing: number[]
  // 出错củahạng hai数
  wrongCount: number
  // Mỗi chữ cái gõ sai là gì?, index vì字母của索引, 数组内vì错误của e.key
  mistakes: LetterMistakes
}

export interface LetterMistakes {
  // Mỗi chữ cái gõ sai là gì?, index vì字母của索引, 数组内vì错误của e.key
  [index: number]: string[]
}

export class WordRecord implements IWordRecord {
  word: string
  timeStamp: number
  dict: string
  chapter: number | null
  timing: number[]
  wrongCount: number
  mistakes: LetterMistakes

  constructor(word: string, dict: string, chapter: number | null, timing: number[], wrongCount: number, mistakes: LetterMistakes) {
    this.word = word
    this.timeStamp = getUTCUnixTimestamp()
    this.dict = dict
    this.chapter = chapter
    this.timing = timing
    this.wrongCount = wrongCount
    this.mistakes = mistakes
  }

  get totalTime() {
    return this.timing.reduce((acc, curr) => acc + curr, 0)
  }
}

export interface IChapterRecord {
  // 正常chươngvì dictKey, 其他功能则vì对应của类型
  dict: string
  // hiện hữuCâu hỏi sai场景中vì -1
  chapter: number | null
  timeStamp: number
  // 单位vì s，chươngcủaGhi没必要到毫秒级
  time: number
  // 正确theo键hạng hai数，输对một个字母即Ghi
  correctCount: number
  // 错误củatheo键hạng hai数。 Một lỗi sẽ xóa toàn bộ đầu vào，但只Ghimộthạng hai错误
  wrongCount: number
  // 用户输入củatừ总数，可能会sử dụng循环等功能使输入总数大于 20
  wordCount: number
  // mộthạng hai打对未犯错củatừdanh sách, 可以Và wordNumber 对比得出出错củatừ indexes
  correctWordIndexes: number[]
  // chương总số lượng từ
  wordNumber: number
  // từ record của id danh sách
  wordRecordIds: number[]
}

export class ChapterRecord implements IChapterRecord {
  dict: string
  chapter: number | null
  timeStamp: number
  time: number
  correctCount: number
  wrongCount: number
  wordCount: number
  correctWordIndexes: number[]
  wordNumber: number
  wordRecordIds: number[]

  constructor(
    dict: string,
    chapter: number | null,
    time: number,
    correctCount: number,
    wrongCount: number,
    wordCount: number,
    correctWordIndexes: number[],
    wordNumber: number,
    wordRecordIds: number[],
  ) {
    this.dict = dict
    this.chapter = chapter
    this.timeStamp = getUTCUnixTimestamp()
    this.time = time
    this.correctCount = correctCount
    this.wrongCount = wrongCount
    this.wordCount = wordCount
    this.correctWordIndexes = correctWordIndexes
    this.wordNumber = wordNumber
    this.wordRecordIds = wordRecordIds
  }

  get wpm() {
    return Math.round((this.wordCount / this.time) * 60)
  }

  get inputAccuracy() {
    return Math.round((this.correctCount / this.correctCount + this.wrongCount) * 100)
  }

  get wordAccuracy() {
    return Math.round((this.correctWordIndexes.length / this.wordNumber) * 100)
  }
}

export interface IReviewRecord {
  id?: number
  dict: string
  // 当前luyện tập进度
  index: number
  // thời gian sáng tạo
  createTime: number
  // 是否đã完成
  isFinished: boolean
  // từdanh sách, 根据ôn tập算法生成Và修改，Có thể có giá trị trùng lặp
  words: Word[]
}

export class ReviewRecord implements IReviewRecord {
  id?: number
  dict: string
  index: number
  createTime: number
  isFinished: boolean
  words: Word[]

  constructor(dict: string, words: Word[]) {
    this.dict = dict
    this.index = 0
    this.createTime = getUTCUnixTimestamp()
    this.words = words
    this.isFinished = false
  }
}

export interface IRevisionDictRecord {
  dict: string
  revisionIndex: number
  createdTime: number
}

export class RevisionDictRecord implements IRevisionDictRecord {
  dict: string
  revisionIndex: number
  createdTime: number

  constructor(dict: string, revisionIndex: number, createdTime: number) {
    this.dict = dict
    this.revisionIndex = revisionIndex
    this.createdTime = createdTime
  }
}

export interface IRevisionWordRecord {
  word: string
  timeStamp: number
  dict: string
  errorCount: number
}

export class RevisionWordRecord implements IRevisionWordRecord {
  word: string
  timeStamp: number
  dict: string
  errorCount: number

  constructor(word: string, dict: string, errorCount: number) {
    this.word = word
    this.timeStamp = getUTCUnixTimestamp()
    this.dict = dict
    this.errorCount = errorCount
  }
}
