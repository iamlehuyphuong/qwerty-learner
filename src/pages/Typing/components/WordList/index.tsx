import { TypingContext, TypingStateActionType } from '../../store'
import WordCard from './WordCard'
import Tooltip from '@/components/Tooltip'
import { Button } from '@/components/ui/button'
import { Drawer } from '@/components/ui/drawer'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import { atom, useAtomValue } from 'jotai'
import { List } from 'lucide-react'
import { useContext, useState } from 'react'

const currentDictTitleData = atom((get) => {
  const isReviewMode = get(isReviewModeAtom)

  if (isReviewMode) {
    return { name: get(currentDictInfoAtom).name, subtitle: 'Ôn tập từ sai' }
  } else {
    return { name: get(currentDictInfoAtom).name, subtitle: `Bài ${get(currentChapterAtom) + 1}` }
  }
})

export default function WordList() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  const [isOpen, setIsOpen] = useState(false)
  const { name, subtitle } = useAtomValue(currentDictTitleData)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
  }

  return (
    <>
      <Tooltip content="Danh sách từ" placement="bottom">
        <Button
          variant="outline"
          size="icon"
          onClick={openModal}
          className="h-12 w-12 shrink-0 rounded-xl border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
        >
          <List className="h-6 w-6" />
        </Button>
      </Tooltip>

      <Drawer
        isOpen={isOpen}
        onClose={closeModal}
        position="left"
        title={
          <div className="flex flex-col gap-1">
            <span className="font-bold">{name}</span>
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{subtitle}</span>
          </div>
        }
      >
        <div className="flex flex-col gap-1">
          {state.chapterData.words?.map((word, index) => {
            return <WordCard word={word} key={`${word.name}_${index}`} isActive={state.chapterData.index === index} />
          })}
        </div>
      </Drawer>
    </>
  )
}
