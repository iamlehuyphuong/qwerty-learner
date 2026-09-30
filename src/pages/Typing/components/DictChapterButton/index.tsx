import Tooltip from '@/components/Tooltip'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import range from '@/utils/range'
import { useAtom, useAtomValue } from 'jotai'
import { NavLink } from 'react-router-dom'
import IconCheck from '~icons/tabler/check'

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const chapterCount = currentDictInfo.chapterCount
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }
  return (
    <>
      <Tooltip content="Chọn từ điển">
        <NavLink
          className="block rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white/60 dark:hover:text-white"
          to="/gallery"
        >
          {currentDictInfo.name} {isReviewMode && 'Ôn tập từ viết sai'}
        </NavLink>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="Chọn chương">
          <Dropdown>
            <DropdownTrigger
              onKeyDown={handleKeyDown}
              className="w-28 rounded-lg px-3 py-1 text-center text-lg transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white/60 dark:hover:text-white"
            >
              Chương {currentChapter + 1}
            </DropdownTrigger>
            <DropdownMenu align="center" className="max-h-60 w-32 overflow-y-auto">
              {range(0, chapterCount, 1).map((index) => {
                const selected = currentChapter === index
                return (
                  <DropdownItem key={index} onClick={() => setCurrentChapter(index)} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center text-indigo-500">
                      {selected && <IconCheck className="focus:outline-none" />}
                    </span>
                    <span>Chương {index + 1}</span>
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>
        </Tooltip>
      )}
    </>
  )
}
