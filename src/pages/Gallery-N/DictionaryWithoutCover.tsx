import DictDetail from './DictDetail'
import { useDictStats } from './hooks/useDictStats'
import bookCover from '@/assets/book-cover.png'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { currentDictIdAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { calcChapterCount } from '@/utils'
import * as Progress from '@radix-ui/react-progress'
import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'

interface Props {
  dictionary: Dictionary
}

export default function DictionaryComponent({ dictionary }: Props) {
  const currentDictID = useAtomValue(currentDictIdAtom)

  const divRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(divRef, {})
  const isVisible = !!entry?.isIntersecting
  const dictStats = useDictStats(dictionary.id, isVisible)
  const chapterCount = useMemo(() => calcChapterCount(dictionary.length), [dictionary.length])
  const isSelected = currentDictID === dictionary.id
  const progress = useMemo(
    () => (dictStats ? Math.ceil((dictStats.exercisedChapterCount / chapterCount) * 100) : 0),
    [dictStats, chapterCount],
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={divRef}
          className={`group flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl p-5 text-left shadow-md transition-all hover:shadow-lg focus:outline-none ${
            isSelected
              ? 'bg-indigo-500'
              : 'dark:hover:bg-gray-750 border border-transparent bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          }`}
          role="button"
          // onClick={onClick}
        >
          <div className="relative flex h-full w-full flex-col items-start justify-center">
            <h1
              className={`relative z-10 mb-1 w-full truncate pr-4 text-lg font-medium ${
                isSelected ? 'text-white' : 'text-gray-900 group-hover:text-indigo-500 dark:text-gray-100 dark:group-hover:text-indigo-400'
              }`}
            >
              {dictionary.name}
            </h1>
            <TooltipProvider>
              <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                  <p
                    className={`relative z-10 mb-2 line-clamp-3 w-full pr-4 text-sm ${
                      isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {dictionary.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`${dictionary.description}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <p className={`relative z-10 mb-1 text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
              {dictionary.length} từ
            </p>
            <div className="absolute bottom-0 z-10 w-full pr-4">
              {progress > 0 && (
                <Progress.Root
                  value={progress}
                  max={100}
                  className={`h-1.5 w-full overflow-hidden rounded-full ${
                    isSelected ? 'bg-indigo-300/50' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Progress.Indicator
                    className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </Progress.Root>
              )}
            </div>
            <img
              src={bookCover}
              className={`pointer-events-none absolute right-0 top-1/2 z-0 w-24 -translate-y-1/2 ${
                isSelected ? 'opacity-20' : 'opacity-[0.08] dark:opacity-10'
              }`}
              alt=""
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[60rem] max-w-none !rounded-[20px]">
        <DictDetail dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}
