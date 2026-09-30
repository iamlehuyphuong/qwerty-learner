import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
import { useAtom } from 'jotai'
import { CheckCircle2, Circle, Repeat } from 'lucide-react'
import { useCallback } from 'react'

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER]
export default function LoopWordSwitcher() {
  const [{ times: loopTimes }, setLoopWordConfig] = useAtom(loopWordConfigAtom)

  const onChangeLoopTimes = useCallback(
    (value: number) => {
      setLoopWordConfig((old) => ({
        ...old,
        times: value,
      }))
    },
    [setLoopWordConfig],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`${
            loopTimes === 1 ? 'border-gray-300 text-gray-500 dark:border-gray-700' : 'border-indigo-500 text-indigo-500'
          } h-8 w-8 transition-colors`}
          onFocus={(e) => {
            e.target.blur()
          }}
          aria-label="Số lần lặp lại từ vựng"
        >
          <div className="relative flex items-center justify-center">
            <Repeat className="h-5 w-5" />
            {loopTimes > 1 && (
              <span className="absolute -bottom-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-bold text-white">
                {loopTimes === Number.MAX_SAFE_INTEGER ? '∞' : loopTimes}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Số lần lặp lại từ vựng</span>
          <div className="flex flex-col gap-1">
            {loopOptions.map((value) => {
              const isSelected = loopTimes === value
              return (
                <button
                  key={value}
                  type="button"
                  className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors hover:bg-indigo-500/20 hover:text-foreground ${
                    isSelected ? 'bg-muted font-medium text-foreground' : 'text-foreground'
                  }`}
                  onClick={() => onChangeLoopTimes(value)}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                  ) : (
                    <Circle className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-indigo-400" />
                  )}
                  <span className="flex-1 text-left leading-none">{value === Number.MAX_SAFE_INTEGER ? 'Không giới hạn' : value}</span>
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
