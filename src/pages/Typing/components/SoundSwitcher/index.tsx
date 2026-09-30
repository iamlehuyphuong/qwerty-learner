import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { hintSoundsConfigAtom, keySoundsConfigAtom } from '@/store'
import { useAtom } from 'jotai'
import { Volume2 } from 'lucide-react'
import { useCallback } from 'react'

export default function SoundSwitcher() {
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onChangeKeySound = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setKeySoundsConfig],
  )

  const onChangeHintSound = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setHintSoundsConfig],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-indigo-500 text-indigo-500 transition-colors"
          onFocus={(e) => {
            e.target.blur()
          }}
          aria-label="Cài đặt âm thanh"
          title="Cài đặt âm thanh"
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between py-1">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Âm thanh gõ phím</span>
            <Switch checked={keySoundsConfig.isOpen} onChange={(e) => onChangeKeySound(e.target.checked)} />
          </div>
          <div className="flex w-full flex-row items-center justify-between py-1">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white/60">Hiệu ứng âm thanh</span>
            <Switch checked={hintSoundsConfig.isOpen} onChange={(e) => onChangeHintSound(e.target.checked)} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
