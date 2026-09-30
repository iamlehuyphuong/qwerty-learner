import { LoadingWordUI } from '../LoadingWordUI'
import useGetWord from '../hooks/useGetWord'
import { currentRowDetailAtom } from '../store'
import type { groupedWordRecords } from '../type'
import DataTag from './DataTag'
import RowPagination from './RowPagination'
import type { WordPronunciationIconRef } from '@/components/WordPronunciationIcon'
import { WordPronunciationIcon } from '@/components/WordPronunciationIcon'
import { Button } from '@/components/ui/button'
import Phonetic from '@/pages/Typing/components/WordPanel/components/Phonetic'
import Letter from '@/pages/Typing/components/WordPanel/components/Word/Letter'
import { idDictionaryMap } from '@/resources/dictionary'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import HashtagIcon from '~icons/heroicons/chart-pie-20-solid'
import CheckCircle from '~icons/heroicons/check-circle-20-solid'
import ClockIcon from '~icons/heroicons/clock-20-solid'
import XCircle from '~icons/heroicons/x-circle-20-solid'
import IconX from '~icons/tabler/x'

type RowDetailProps = {
  currentRowDetail: groupedWordRecords
  allRecords: groupedWordRecords[]
}

const RowDetail: React.FC<RowDetailProps> = ({ currentRowDetail, allRecords }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)

  const dictInfo = idDictionaryMap[currentRowDetail.dict]
  const { word, isLoading, hasError } = useGetWord(currentRowDetail.word, dictInfo)
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)

  const rowDetailData: RowDetailData = useMemo(() => {
    const time =
      currentRowDetail.records.length > 0
        ? currentRowDetail.records.reduce((acc, cur) => acc + cur.totalTime, 0) / currentRowDetail.records.length
        : 0
    const timeStr = (time / 1000).toFixed(2)
    const practiceCount = currentRowDetail.records.length
    const correctCount = currentRowDetail.records.reduce((acc, cur) => acc + cur.timing.length, 0)
    const wrongCount = currentRowDetail.wrongCount
    return { time: timeStr, practiceCount, correctCount, wrongCount }
  }, [currentRowDetail.records, currentRowDetail.wrongCount])

  const onClose = useCallback(() => {
    setCurrentRowDetail(null)
  }, [setCurrentRowDetail])

  useHotkeys(
    'esc',
    (e) => {
      onClose()
      e.stopPropagation()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'ctrl+j',
    () => {
      wordPronunciationIconRef.current?.play()
    },
    [],
    { enableOnFormTags: true, preventDefault: true },
  )

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="my-card relative z-10 flex h-[32rem] w-[36rem] select-text flex-col items-center justify-around rounded-2xl border border-border bg-card px-6 py-10 text-card-foreground">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={onClose}>
          <IconX className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center justify-start">
          <div>
            {currentRowDetail.word.split('').map((t, index) => (
              <Letter key={`${index}-${t}`} letter={t} visible state="normal" />
            ))}
          </div>
          <div className="relative flex h-8 items-center">
            {word ? <Phonetic word={word} /> : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            {word && (
              <WordPronunciationIcon
                lang={dictInfo.language}
                word={word}
                className="absolute -right-7 top-1/2 h-5 w-5 -translate-y-1/2 transform"
                ref={wordPronunciationIconRef}
              />
            )}
          </div>
          <div className="flex max-w-[24rem] items-center">
            <span className="max-w-4xl text-center font-sans text-muted-foreground transition-colors duration-300">
              {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <DataTag icon={ClockIcon} name="TB mỗi lần (s)" data={rowDetailData.time} />
            <DataTag icon={HashtagIcon} name="Số lần luyện tập" data={rowDetailData.practiceCount} />
          </div>
          <div className="flex gap-4">
            <DataTag icon={CheckCircle} name="Số lần nhấn đúng" data={rowDetailData.correctCount} />
            <DataTag icon={XCircle} name="Số lần nhấn sai" data={rowDetailData.wrongCount} />
          </div>
        </div>
        <RowPagination className="absolute bottom-6 mt-10" allRecords={allRecords} />
      </div>
      <div className="absolute inset-0 z-0 cursor-pointer bg-black/30" onClick={onClose}></div>
    </div>
  )
}

type RowDetailData = {
  time: string
  practiceCount: number
  correctCount: number
  wrongCount: number
}

export default RowDetail
