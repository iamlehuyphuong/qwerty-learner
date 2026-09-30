import { CHAPTER_LENGTH } from '@/constants'
import { currentChapterAtom, currentDictInfoAtom, reviewModeInfoAtom } from '@/store'
import type { Word, WordWithIndex } from '@/typings/index'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import useSWR from 'swr'

export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom)

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0)
  }

  const isFirstChapter = !isReviewMode && currentDictInfo.id === 'cet4' && currentChapter === 0
  const { data: wordList, error, isLoading } = useSWR(currentDictInfo.url, wordListFetcher)

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[]
    if (isFirstChapter) {
      newWords = firstChapter
    } else if (isReviewMode) {
      newWords = reviewRecord?.words ?? []
    } else if (wordList) {
      newWords = wordList.slice(currentChapter * CHAPTER_LENGTH, (currentChapter + 1) * CHAPTER_LENGTH)
    } else {
      newWords = []
    }

    // ghi lại bản gốc index, Và để word.trans Làm một công việc kỹ lưỡng
    return newWords.map((word, index) => {
      let trans: string[]
      if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === 'string')
      } else if (word.trans === null || word.trans === undefined || typeof word.trans === 'object') {
        trans = []
      } else {
        trans = [String(word.trans)]
      }
      return {
        ...word,
        index,
        trans,
      }
    })
  }, [isFirstChapter, isReviewMode, wordList, reviewRecord?.words, currentChapter])

  return { words, isLoading, error }
}

const firstChapter = [
  { name: 'cancel', trans: ['Hủy bỏ， Hủy bỏ； Xóa bỏ'], usphone: "'kænsl", ukphone: "'kænsl" },
  { name: 'explosive', trans: ['爆炸của； 极易引起争论của', 'thuốc nổ'], usphone: "ɪk'splosɪv; ɪk'splozɪv", ukphone: "ɪk'spləusɪv" },
  { name: 'numerous', trans: ['众nhiềucủa'], usphone: "'numərəs", ukphone: "'njuːmərəs" },
  { name: 'govern', trans: ['trội， Thống trị', 'luật lệ，quản trị，Thống trị'], usphone: "'ɡʌvɚn", ukphone: "'gʌvn" },
  { name: 'analyse', trans: ['phân tích； phá vỡ； phân tích cú pháp'], usphone: "'æn(ə)laɪz", ukphone: "'ænəlaɪz" },
  { name: 'discourage', trans: ['làm nản lòng， làm nản lòng； Ngăn chặn， khuyên can'], usphone: "dɪs'kɝɪdʒ", ukphone: "dɪs'kʌrɪdʒ" },
  { name: 'resemble', trans: ['hình ảnh， Tương tự như'], usphone: "rɪ'zɛmbl", ukphone: "rɪ'zembl" },
  {
    name: 'remote',
    trans: ['遥远của； 偏僻của； 关系疏远của； 脱离của； 微乎其微của； 孤高của， 冷淡của； 遥控của'],
    usphone: "rɪ'mot",
    ukphone: "rɪ'məut",
  },
  { name: 'salary', trans: ['lương， lương'], usphone: "'sæləri", ukphone: "'sæləri" },
  { name: 'pollution', trans: ['làm ô nhiễm， chất ô nhiễm'], usphone: "pə'luʃən", ukphone: "pə'luːʃn" },
  { name: 'pretend', trans: ['Giả vờ， giả vờ'], usphone: "prɪ'tɛnd", ukphone: "prɪ'tend" },
  { name: 'kettle', trans: ['ấm đun nước'], usphone: "'kɛtl", ukphone: "'ketl" },
  { name: 'wreck', trans: ['bị đắm；đống đổ nát；精神或身体已垮của人', 'hủy hoại'], usphone: 'rɛk', ukphone: 'rek' },
  { name: 'drunk', trans: ['醉của； 陶醉của'], usphone: 'drʌŋk', ukphone: 'drʌŋk' },
  { name: 'calculate', trans: ['tính toán； ước lượng； kế hoạch'], usphone: "'kælkjulet", ukphone: "'kælkjuleɪt" },
  { name: 'persistent', trans: ['kiên trìcủa， 不屈不挠của； 持续不断của； 反复出现của'], usphone: "pə'zɪstənt", ukphone: "pə'sɪstənt" },
  { name: 'sake', trans: ['lý do， lý do'], usphone: 'sek', ukphone: 'seɪk' },
  { name: 'conceal', trans: ['Bó…trốn， che phủ， trốn'], usphone: "kən'sil", ukphone: "kən'siːl" },
  { name: 'audience', trans: ['khán giả， khán giả， người đọc'], usphone: "'ɔdɪəns", ukphone: "'ɔːdiəns" },
  { name: 'meanwhile', trans: ['与此cùng lúc'], usphone: "'minwaɪl", ukphone: "'miːnwaɪl" },
]
