import type { WordWithIndex } from '@/typings'
import type { LetterMistakes } from '@/utils/db/record'

export type ChapterData = {
  // warning: 因vì有chương内随机của存hiện hữu，Tất cả hồ sơ index của场景都应该sử dụng WordWithIndex.index
  words: WordWithIndex[]
  // chapter index
  index: number
  // 输入củasố lượng từ
  wordCount: number
  // 输入正确củasố lượng từ
  correctCount: number
  // 输入错误củasố lượng từ
  wrongCount: number
  // 每từcủa输入Ghi
  userInputLogs: UserInputLog[]
  // 本chương用户输入củatừcủa record id danh sách
  wordRecordIds: number[]
}

export type UserInputLog = {
  // the index in ChapterData.words, not the index in WordWithIndex
  index: number
  correctCount: number
  wrongCount: number
  LetterMistakes: LetterMistakes
}

export type TimerData = {
  time: number
  accuracy: number
  wpm: number
}

export type WrongWordData = {
  name: string
  wrongCount: number
  wrongLetters: Array<{
    letter: string
    count: number
  }>
}

export type TypingState = {
  chapterData: ChapterData
  timerData: TimerData
  isTyping: boolean
  isFinished: boolean
  isShowSkip: boolean
  isTransVisible: boolean
  isLoopSingleWord: boolean
  // Dữ liệu có đang được lưu không?
  isSavingRecord: boolean
}
