import { GalleryContext } from '.'
import deFlag from '@/assets/flags/de.png'
import enFlag from '@/assets/flags/en.png'
import jpFlag from '@/assets/flags/ja.png'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCategoryType } from '@/typings'
import { useCallback, useContext } from 'react'

export type LanguageTabOption = {
  id: LanguageCategoryType
  name: string
  flag: string
}

const options: LanguageTabOption[] = [
  { id: 'en', name: 'Tiếng Anh', flag: enFlag },
  { id: 'ja', name: 'Tiếng Nhật', flag: jpFlag },
  { id: 'de', name: 'Tiếng Đức', flag: deFlag },
]

export function LanguageTabSwitcher() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { state, setState } = useContext(GalleryContext)!

  const onChangeTab = useCallback(
    (tab: string) => {
      setState((draft) => {
        draft.currentLanguageTab = tab as LanguageCategoryType
      })
    },
    [setState],
  )

  return (
    <Tabs value={state.currentLanguageTab} onValueChange={onChangeTab}>
      <TabsList className="h-12 w-max justify-start bg-slate-100 p-1 dark:bg-slate-800">
        {options.map((option) => (
          <TabsTrigger key={option.id} value={option.id} className="flex items-center gap-2 px-6 py-2">
            <img src={option.flag} className="h-5 w-5 rounded-[2px] object-cover shadow-sm" alt="" />
            <span className="text-base font-medium">{option.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
