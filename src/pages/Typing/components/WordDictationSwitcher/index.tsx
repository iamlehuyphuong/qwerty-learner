import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { wordDictationConfigAtom } from '@/store'
import type { WordDictationType } from '@/typings'
import { useAtom } from 'jotai'
import { Eye, EyeOff } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  {
    name: 'Ẩn tất cả',
    type: 'hideAll',
  },
  {
    name: 'Ẩn nguyên âm',
    type: 'hideVowel',
  },
  {
    name: 'Ẩn phụ âm',
    type: 'hideConsonant',
  },
  {
    name: 'Ẩn ngẫu nhiên',
    type: 'randomHide',
  },
]

export default function WordDictationSwitcher() {
  const [wordDictationConfig, setWordDictationConfig] = useAtom(wordDictationConfigAtom)
  const [currentType, setCurrentType] = useState(wordDictationTypeList[0])

  const onToggleWordDictation = () => {
    setWordDictationConfig((old) => {
      if (!old.isOpen) {
        return { ...old, isOpen: !old.isOpen, openBy: 'user' }
      } else {
        return { ...old, isOpen: !old.isOpen }
      }
    })
  }

  const onChangeWordDictationType = (value: WordDictationType) => {
    setWordDictationConfig((old) => {
      return { ...old, type: value }
    })
  }

  useLayoutEffect(() => {
    setCurrentType(wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0])
  }, [wordDictationConfig.type])

  useHotkeys(
    'ctrl+v',
    () => {
      onToggleWordDictation()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`${
            wordDictationConfig.isOpen ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-500 dark:border-gray-700'
          } h-8 w-8 transition-colors`}
          aria-label="Bật tắt chế độ viết im lặng"
        >
          {wordDictationConfig.isOpen ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between py-0">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Chế độ viết im lặng</span>
            <Switch checked={wordDictationConfig.isOpen} onChange={() => onToggleWordDictation()} />
          </div>

          {wordDictationConfig.isOpen && (
            <div className="animate-in slide-in-from-top-2 flex w-full flex-col items-start gap-2 py-0">
              <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Loại ẩn chữ</span>
              <div className="flex w-full flex-row items-center justify-between">
                <Select value={currentType.type} onChange={(value) => onChangeWordDictationType(value as WordDictationType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wordDictationTypeList.map((item) => (
                      <SelectItem key={item.name} value={item.type}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
