import Tooltip from '@/components/Tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LANG_PRON_MAP } from '@/resources/soundResource'
import { currentDictInfoAtom, phoneticConfigAtom, pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { PRONUNCIATION_PHONETIC_MAP } from '@/typings'
import { CTRL } from '@/utils'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const PronunciationSwitcher = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [phoneticConfig, setPhoneticConfig] = useAtom(phoneticConfigAtom)
  const pronunciationList = useMemo(() => LANG_PRON_MAP[currentDictInfo.language].pronunciation, [currentDictInfo.language])

  useEffect(() => {
    const defaultPronIndex = currentDictInfo.defaultPronIndex || LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex
    const defaultPron = pronunciationList[defaultPronIndex]

    // if the current pronunciation is not in the pronunciation list, reset the pronunciation config to default
    const index = pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type)
    if (index === -1) {
      // only change the type and name, keep the isOpen state
      setPronunciationConfig((old) => ({
        ...old,
        type: defaultPron.pron,
        name: defaultPron.name,
      }))
    }
  }, [currentDictInfo.defaultPronIndex, currentDictInfo.language, setPronunciationConfig, pronunciationList, pronunciationConfig.type])

  useEffect(() => {
    const phoneticType = PRONUNCIATION_PHONETIC_MAP[pronunciationConfig.type]
    if (phoneticType) {
      setPhoneticConfig((old) => ({
        ...old,
        type: phoneticType,
      }))
    }
  }, [pronunciationConfig.type, setPhoneticConfig])

  const onChangePronunciationIsOpen = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isOpen: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationIsTransRead = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isTransRead: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationIsLoop = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isLoop: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePhoneticIsOpen = useCallback(
    (value: boolean) => {
      setPhoneticConfig((old) => ({
        ...old,
        isOpen: value,
      }))
    },
    [setPhoneticConfig],
  )

  const onChangePronunciationType = useCallback(
    (value: PronunciationType) => {
      const item = pronunciationList.find((item) => item.pron === value)
      if (item) {
        setPronunciationConfig((old) => ({
          ...old,
          type: item.pron,
          name: item.name,
        }))
      }
    },
    [setPronunciationConfig, pronunciationList],
  )

  const currentLabel = useMemo(() => {
    if (pronunciationConfig.isOpen) {
      return pronunciationConfig.name
    } else {
      return 'Đang tắt'
    }
  }, [pronunciationConfig.isOpen, pronunciationConfig.name])

  return (
    <Popover>
      <Tooltip content="Cài đặt phát âm và phiên âm">
        <PopoverTrigger asChild>
          <button
            className={`flex h-10 w-28 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-transparent px-1 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:border-gray-700 dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100`}
            onFocus={(e) => {
              e.target.blur()
            }}
          >
            {currentLabel}
          </button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-72 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between py-1">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Hiển thị phiên âm</span>
            <Switch checked={phoneticConfig.isOpen} onChange={(e) => onChangePhoneticIsOpen(e.target.checked)} />
          </div>
          <div className="flex w-full flex-row items-center justify-between py-1">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Phát âm từ vựng</span>
            <Switch checked={pronunciationConfig.isOpen} onChange={(e) => onChangePronunciationIsOpen(e.target.checked)} />
          </div>
          {window.speechSynthesis && (
            <div className="flex w-full flex-row items-center justify-between py-1">
              <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Đọc nghĩa của từ</span>
              <Switch checked={pronunciationConfig.isTransRead} onChange={(e) => onChangePronunciationIsTransRead(e.target.checked)} />
            </div>
          )}
          {pronunciationConfig.isOpen && (
            <div className="animate-in slide-in-from-top-2 flex w-full flex-col gap-4">
              <div className="flex w-full flex-row items-center justify-between py-1">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Lặp lại phát âm</span>
                <Switch checked={pronunciationConfig.isLoop} onChange={(e) => onChangePronunciationIsLoop(e.target.checked)} />
              </div>
              <div className="flex w-full flex-row items-center justify-between py-1">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Giọng đọc</span>
                <div className="w-32">
                  <Select value={pronunciationConfig.type} onChange={onChangePronunciationType}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pronunciationList.map((item) => (
                        <SelectItem key={item.pron} value={item.pron}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                Mẹo: Phím tắt phát âm ({CTRL} + J)
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PronunciationSwitcher
