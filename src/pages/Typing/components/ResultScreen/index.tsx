import { TypingContext, TypingStateActionType } from '../../store'
import ShareButton from '../ShareButton'
import ConclusionBar from './ConclusionBar'
import WordChip from './WordChip'
import styles from './index.module.css'
import Tooltip from '@/components/Tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  infoPanelStateAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IexportWords from '~icons/icon-park-outline/excel'
import IconCoffee from '~icons/mdi/coffee'
import IconZalo from '~icons/my-icons/zalo'
import IconFacebook from '~icons/simple-icons/facebook'

const iconBtnClass =
  'h-8 w-8 border border-solid !border-slate-500 !bg-transparent text-indigo-500 transition-colors hover:!bg-indigo-500/10 hover:text-indigo-600'

const ResultScreen = () => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const setInfoPanelState = useSetAtom(infoPanelStateAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const navigate = useNavigate()

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  useEffect(() => {
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 })
  }, [dispatch])

  const exportWords = useCallback(() => {
    const { words, userInputLogs } = state.chapterData
    const exportData = userInputLogs.map((log) => {
      const word = words[log.index]
      const wordName = word.name
      return {
        ...word,
        trans: word.trans.join(';'),
        correctCount: log.correctCount,
        wrongCount: log.wrongCount,
        wrongLetters: Object.entries(log.LetterMistakes)
          .map(([key, mistakes]) => `${wordName[Number(key)]}:${mistakes.length}`)
          .join(';'),
      }
    })

    import('xlsx')
      .then(({ utils, writeFileXLSX }) => {
        const ws = utils.json_to_sheet(exportData)
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, 'Data')
        writeFileXLSX(wb, `${currentDictInfo.name}Chuong_${currentChapter + 1}.xlsx`)
      })
      .catch(() => {
        console.log('viết xlsx Nhập mô-đun không thành công')
      })
  }, [currentChapter, currentDictInfo.name, state.chapterData])

  const wrongWords = useMemo(() => {
    return state.chapterData.userInputLogs
      .filter((log) => log.wrongCount > 0)
      .map((log) => state.chapterData.words[log.index])
      .filter((word) => word !== undefined)
  }, [state.chapterData.userInputLogs, state.chapterData.words])

  const isLastChapter = useMemo(() => {
    return currentChapter >= currentDictInfo.chapterCount - 1
  }, [currentChapter, currentDictInfo])

  const correctRate = useMemo(() => {
    const chapterLength = state.chapterData.words.length
    const correctCount = chapterLength - wrongWords.length
    return Math.floor((correctCount / chapterLength) * 100)
  }, [state.chapterData.words.length, wrongWords.length])

  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) {
      return 0
    } else if (correctRate >= 70) {
      return 1
    } else {
      return 2
    }
  }, [correctRate])

  const timeString = useMemo(() => {
    const seconds = state.timerData.time
    const minutes = Math.floor(seconds / 60)
    const minuteString = minutes < 10 ? '0' + minutes : minutes + ''
    const restSeconds = seconds % 60
    const secondString = restSeconds < 10 ? '0' + restSeconds : restSeconds + ''
    return `${minuteString}:${secondString}`
  }, [state.timerData.time])

  const repeatButtonHandler = useCallback(async () => {
    if (isReviewMode) return
    setWordDictationConfig((old) => {
      if (old.isOpen && old.openBy === 'auto') return { ...old, isOpen: false }
      return old
    })
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  const dictationButtonHandler = useCallback(async () => {
    if (isReviewMode) return
    setWordDictationConfig((old) => ({ ...old, isOpen: true, openBy: 'auto' }))
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  const nextButtonHandler = useCallback(() => {
    if (isReviewMode) return
    setWordDictationConfig((old) => {
      if (old.isOpen && old.openBy === 'auto') return { ...old, isOpen: false }
      return old
    })
    if (!isLastChapter) {
      setCurrentChapter((old) => old + 1)
      dispatch({ type: TypingStateActionType.NEXT_CHAPTER })
    }
  }, [dispatch, isLastChapter, isReviewMode, setCurrentChapter, setWordDictationConfig])

  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    } else {
      dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false })
    }
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo])

  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0)
    setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    navigate('/gallery')
  }, [navigate, setCurrentChapter, setReviewModeInfo])

  useHotkeys(
    'enter',
    () => {
      nextButtonHandler()
    },
    { preventDefault: true },
  )
  useHotkeys(
    'space',
    (e) => {
      e.stopPropagation()
      repeatButtonHandler()
    },
    { preventDefault: true },
  )
  useHotkeys(
    'shift+enter',
    () => {
      dictationButtonHandler()
    },
    { preventDefault: true },
  )

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'resultScreen')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) exitButtonHandler()
      }}
    >
      <DialogContent
        className="w-[90vw] max-w-5xl overflow-hidden rounded-2xl p-0 dark:border-gray-700 dark:bg-gray-800 md:w-4/5 lg:w-3/5"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col px-10 pb-10 pt-8">
          {/* Title */}
          <div className="text-center font-sans text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl">
            {`${currentDictInfo.name} ${isReviewMode ? 'Ôn tập từ gõ sai' : 'Bài ' + (currentChapter + 1)}`}
          </div>

          <div className="mt-10 flex flex-row items-stretch gap-4 overflow-hidden">
            {/* Left: stats */}
            <div className="flex shrink-0 grow-0 flex-col items-center justify-center gap-8 px-2">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold tabular-nums text-foreground">{state.timerData.accuracy}%</span>
                <span className="text-center text-xs text-muted-foreground">Tỷ lệ chính xác</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold tabular-nums text-foreground">{timeString}</span>
                <span className="text-center text-xs text-muted-foreground">Thời gian hoàn thành</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold tabular-nums text-foreground">{state.timerData.wpm}</span>
                <span className="text-center text-xs text-muted-foreground">Từ/Phút</span>
              </div>
            </div>

            {/* Center: word chip area */}
            <div className="z-10 flex-1 overflow-visible rounded-xl bg-indigo-50 dark:bg-gray-700/60">
              <div className="customized-scrollbar z-20 ml-8 mr-1 flex h-80 flex-row flex-wrap content-start gap-3 overflow-y-auto overflow-x-hidden pr-7 pt-9">
                {wrongWords.map((word, index) => (
                  <WordChip key={`${index}-${word.name}`} word={word} />
                ))}
              </div>
              <div className="align-center flex w-full flex-row justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-indigo-500/70">
                <ConclusionBar mistakeLevel={mistakeLevel} mistakeCount={wrongWords.length} />
              </div>
            </div>

            {/* Right: action icon buttons — header style */}
            <div className="flex shrink-0 flex-col items-center justify-center gap-3 px-2 py-4">
              {!isReviewMode && <ShareButton />}
              {!isReviewMode && (
                <Button variant="ghost" size="icon" type="button" onClick={exportWords} title="Xuất Excel" className={iconBtnClass}>
                  <IexportWords className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" asChild className={iconBtnClass} title="Liên hệ qua Zalo">
                <a href={`https://zalo.me/${import.meta.env.VITE_ZALO_PHONE || '0123456789'}`} target="_blank" rel="noreferrer">
                  <IconZalo className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className={iconBtnClass} title="Trang Facebook">
                <a href={`https://facebook.com/${import.meta.env.VITE_FACEBOOK_USERNAME || 'username'}`} target="_blank" rel="noreferrer">
                  <IconFacebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={(e) => {
                  handleOpenInfoPanel('donate')
                  e.currentTarget.blur()
                }}
                title="Đóng góp cho dự án"
                className={`${iconBtnClass} ${styles.imgShake}`}
              >
                <IconCoffee className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom: action buttons */}
          <div className="mt-10 flex w-full justify-center gap-4 px-5">
            {!isReviewMode && (
              <>
                <Tooltip content="phím tắt：shift + enter">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    onClick={dictationButtonHandler}
                    title="Luyện tập lại bài này"
                    className="dark:border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    Luyện tập lại bài này
                  </Button>
                </Tooltip>
                <Tooltip content="phím tắt：space">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    onClick={repeatButtonHandler}
                    title="Lặp lại phần này"
                    className="dark:border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    Lặp lại phần này
                  </Button>
                </Tooltip>
              </>
            )}
            {!isLastChapter && !isReviewMode && (
              <Tooltip content="phím tắt：enter">
                <Button variant="default" size="lg" type="button" onClick={nextButtonHandler} title="Bài tiếp theo">
                  Bài tiếp theo
                </Button>
              </Tooltip>
            )}
            {isReviewMode && (
              <Button variant="default" size="lg" type="button" onClick={onNavigateToGallery} title="Luyện tập bài khác">
                Luyện tập bài khác
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResultScreen
