import Tooltip from '@/components/Tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import range from '@/utils/range'
import { useAtom, useAtomValue } from 'jotai'
import { NavLink } from 'react-router-dom'

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
          className="flex h-10 items-center rounded-lg border border-gray-300 px-3 text-lg transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:border-gray-700 dark:text-white/60 dark:hover:text-white"
          to="/gallery"
        >
          {currentDictInfo.name} {isReviewMode && 'Ôn tập từ viết sai'}
        </NavLink>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="Chọn chương">
          <div className="w-36">
            <Select value={currentChapter.toString()} onChange={(val) => setCurrentChapter(parseInt(val))}>
              <SelectTrigger
                onKeyDown={handleKeyDown}
                className="h-10 w-full border-gray-300 text-lg hover:bg-indigo-400 hover:text-white focus:ring-0 dark:border-gray-700 dark:hover:bg-indigo-400 dark:hover:text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {range(0, chapterCount, 1).map((index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {`Chương ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
      )}
    </>
  )
}
