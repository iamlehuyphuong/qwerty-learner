import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Radio } from '@/components/ui/radio'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
import { useAtom } from 'jotai'
import { Repeat } from 'lucide-react'
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
          aria-label="Chọn số lần để duyệt qua một từ"
        >
          <div className="relative flex items-center justify-center">
            <Repeat className="h-5 w-5" />
            {loopTimes !== 1 && loopTimes !== Number.MAX_SAFE_INTEGER && (
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-white text-[8px] font-bold dark:bg-gray-800">
                {loopTimes}
              </span>
            )}
            {loopTimes === 1 && (
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-white text-[8px] font-bold dark:bg-gray-800">
                <span className="block h-px w-2 rotate-45 bg-gray-500" />
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
            Chọn số lần để duyệt qua một từ
          </span>
          <div className="flex flex-col gap-3">
            {loopOptions.map((value, index) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 text-[15px] leading-none dark:text-white dark:text-opacity-60"
                htmlFor={`r${index}`}
              >
                <Radio
                  id={`r${index}`}
                  name="loopTimes"
                  value={value.toString()}
                  checked={loopTimes === value}
                  onChange={() => onChangeLoopTimes(value)}
                />
                {value === Number.MAX_SAFE_INTEGER ? 'không giới hạn' : value}
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
