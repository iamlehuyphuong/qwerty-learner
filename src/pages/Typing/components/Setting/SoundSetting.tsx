import styles from './index.module.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { keySoundResources } from '@/resources/soundResource'
import { hintSoundsConfigAtom, keySoundsConfigAtom, pronunciationConfigAtom } from '@/store'
import type { SoundResource } from '@/typings'
import { toFixedNumber } from '@/utils'
import { playKeySoundResource } from '@/utils/sounds/keySounds'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Slider from '@radix-ui/react-slider'
import { useAtom } from 'jotai'
import { Volume2 } from 'lucide-react'
import { useCallback } from 'react'

export default function SoundSetting() {
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onTogglePronunciation = useCallback(() => {
    setPronunciationConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }))
  }, [setPronunciationConfig])

  const onTogglePronunciationIsTransRead = useCallback(() => {
    setPronunciationConfig((prev) => ({ ...prev, isTransRead: !prev.isTransRead }))
  }, [setPronunciationConfig])

  const onChangePronunciationVolume = useCallback(
    (value: [number]) => {
      setPronunciationConfig((prev) => ({ ...prev, volume: value[0] / 100 }))
    },
    [setPronunciationConfig],
  )
  const onChangePronunciationIsTransVolume = useCallback(
    (value: [number]) => {
      setPronunciationConfig((prev) => ({ ...prev, transVolume: value[0] / 100 }))
    },
    [setPronunciationConfig],
  )
  const onChangePronunciationRate = useCallback(
    (value: [number]) => {
      setPronunciationConfig((prev) => ({ ...prev, rate: value[0] }))
    },
    [setPronunciationConfig],
  )

  const onToggleKeySounds = useCallback(() => {
    setKeySoundsConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }))
  }, [setKeySoundsConfig])

  const onChangeKeySoundsVolume = useCallback(
    (value: [number]) => {
      setKeySoundsConfig((prev) => ({ ...prev, volume: value[0] / 100 }))
    },
    [setKeySoundsConfig],
  )

  const onChangeKeySoundsResource = useCallback(
    (key: string) => {
      const soundResource = keySoundResources.find((item: SoundResource) => item.key === key) as SoundResource
      if (!soundResource) return
      setKeySoundsConfig((prev) => ({ ...prev, resource: soundResource }))
    },
    [setKeySoundsConfig],
  )

  const onPlayKeySound = useCallback((soundResource: SoundResource) => {
    playKeySoundResource(soundResource)
  }, [])

  const onToggleHintSounds = useCallback(() => {
    setHintSoundsConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }))
  }, [setHintSoundsConfig])

  const onChangeHintSoundsVolume = useCallback(
    (value: [number]) => {
      setHintSoundsConfig((prev) => ({ ...prev, volume: value[0] / 100 }))
    },
    [setHintSoundsConfig],
  )

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Phát âm từ</span>
              <Switch checked={pronunciationConfig.isOpen} onChange={onTogglePronunciation} />
            </div>
            <div className={styles.block}>
              <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Âm lượng</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  defaultValue={[pronunciationConfig.volume * 100]}
                  max={100}
                  step={10}
                  className="slider"
                  onValueChange={onChangePronunciationVolume}
                  disabled={!pronunciationConfig.isOpen}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${Math.floor(
                  pronunciationConfig.volume * 100,
                )}%`}</span>
              </div>
            </div>
            <div className={styles.block}>
              <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Tốc độ phát</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  defaultValue={[pronunciationConfig.rate ?? 1]}
                  max={4}
                  min={0.5}
                  step={0.1}
                  className="slider"
                  onValueChange={onChangePronunciationRate}
                  disabled={!pronunciationConfig.isOpen}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${toFixedNumber(
                  pronunciationConfig.rate,
                  2,
                )}`}</span>
              </div>
            </div>
          </div>

          {window.speechSynthesis && (
            <div className={styles.section}>
              <div className="flex w-full items-center justify-between">
                <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Phát âm định nghĩa</span>
                <Switch checked={pronunciationConfig.isTransRead} onChange={onTogglePronunciationIsTransRead} />
              </div>
              <div className={styles.block}>
                <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Âm lượng</span>
                <div className="flex h-5 w-full items-center justify-between">
                  <Slider.Root
                    defaultValue={[pronunciationConfig.transVolume * 100]}
                    max={100}
                    step={10}
                    className="slider"
                    onValueChange={onChangePronunciationIsTransVolume}
                  >
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumb />
                  </Slider.Root>
                  <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${Math.floor(
                    pronunciationConfig.transVolume * 100,
                  )}%`}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Âm thanh phím</span>
              <Switch checked={keySoundsConfig.isOpen} onChange={onToggleKeySounds} />
            </div>
            <div className={styles.block}>
              <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Âm lượng</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  defaultValue={[keySoundsConfig.volume * 100]}
                  max={100}
                  min={1}
                  step={10}
                  className="slider"
                  onValueChange={onChangeKeySoundsVolume}
                  disabled={!keySoundsConfig.isOpen}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${Math.floor(
                  keySoundsConfig.volume * 100,
                )}%`}</span>
              </div>
            </div>
            <div className={styles.block}>
              <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Hiệu ứng âm thanh phím</span>
              <Select value={keySoundsConfig.resource.key} onChange={onChangeKeySoundsResource}>
                <SelectTrigger className="h-9 w-60 border-gray-600" disabled={!keySoundsConfig.isOpen}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent portal className="max-h-60">
                  {keySoundResources.map((keySoundResource) => (
                    <SelectItem
                      key={keySoundResource.key}
                      value={keySoundResource.key}
                      icon={
                        <Volume2
                          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-indigo-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            onPlayKeySound(keySoundResource)
                          }}
                        />
                      }
                    >
                      {keySoundResource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Hiệu ứng âm thanh</span>
              <Switch checked={hintSoundsConfig.isOpen} onChange={onToggleHintSounds} />
            </div>
            <div className={styles.block}>
              <span className={`${styles.blockLabel} text-gray-600 dark:text-white/90`}>Âm lượng</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  defaultValue={[hintSoundsConfig.volume * 100]}
                  max={100}
                  min={1}
                  step={10}
                  className="slider"
                  onValueChange={onChangeHintSoundsVolume}
                  disabled={!hintSoundsConfig.isOpen}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${Math.floor(
                  hintSoundsConfig.volume * 100,
                )}%`}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
