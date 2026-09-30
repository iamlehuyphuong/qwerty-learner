import type { LetterState } from './Letter'
import type { LetterMistakes } from '@/utils/db/record'

export type WordState = {
  displayWord: string
  inputWord: string
  letterStates: LetterState[]
  isFinished: boolean
  // Có bất kỳ lỗi đầu vào nào không?
  hasWrong: boolean
  // Ghi是否đã出现过输入错误
  hasMadeInputWrong: boolean
  // 用户输入错误củahạng hai数
  wrongCount: number
  startTime: string
  endTime: string
  inputCount: number
  correctCount: number
  letterTimeArray: number[]
  letterMistake: LetterMistakes
  // Được sử dụng để ẩn ngẫu nhiên chức năng chữ cái
  randomLetterVisible: boolean[]
}

export const initialWordState: WordState = {
  displayWord: '',
  inputWord: '',
  letterStates: [],
  isFinished: false,
  hasWrong: false,
  hasMadeInputWrong: false,
  wrongCount: 0,
  startTime: '',
  endTime: '',
  inputCount: 0,
  correctCount: 0,
  letterTimeArray: [],
  letterMistake: {},
  randomLetterVisible: [],
}
