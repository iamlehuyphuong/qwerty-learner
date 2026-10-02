import DictionaryGroup from './CategoryDicts'
import { LanguageTabSwitcher } from './LanguageTabSwitcher'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { dictionaries } from '@/resources/dictionary'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary, LanguageCategoryType } from '@/typings'
import groupBy, { groupByDictTags } from '@/utils/groupBy'
import { useAtomValue } from 'jotai'
import { X } from 'lucide-react'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

export type GalleryState = {
  currentLanguageTab: LanguageCategoryType
}

const initialGalleryState: GalleryState = {
  currentLanguageTab: 'en',
}

export const GalleryContext = createContext<{
  state: GalleryState
  setState: Updater<GalleryState>
} | null>(null)

export default function GalleryPage() {
  const [galleryState, setGalleryState] = useImmer<GalleryState>(initialGalleryState)
  const navigate = useNavigate()
  const currentDictInfo = useAtomValue(currentDictInfoAtom)

  const { groupedByCategoryAndTag } = useMemo(() => {
    const currentLanguageCategoryDicts = dictionaries.filter((dict) => dict.languageCategory === galleryState.currentLanguageTab)
    const groupedByCategory = Object.entries(groupBy(currentLanguageCategoryDicts, (dict) => dict.category))
    const groupedByCategoryAndTag = groupedByCategory.map(
      ([category, dicts]) => [category, groupByDictTags(dicts)] as [string, Record<string, Dictionary[]>],
    )

    return {
      groupedByCategoryAndTag,
    }
  }, [galleryState.currentLanguageTab])

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  useEffect(() => {
    if (currentDictInfo) {
      setGalleryState((state) => {
        state.currentLanguageTab = currentDictInfo.languageCategory
      })
    }
  }, [currentDictInfo, setGalleryState])

  return (
    <Layout>
      <GalleryContext.Provider value={{ state: galleryState, setState: setGalleryState }}>
        <div className="relative mb-auto mt-auto flex w-full flex-1 flex-col overflow-y-auto px-10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-10 top-10 z-10 h-8 w-8 text-gray-400 hover:text-gray-600"
            onClick={onBack}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
            <div className="flex h-full w-full max-w-6xl flex-col overflow-y-auto">
              <div className="mb-6 flex flex-col items-start pt-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Thư viện từ vựng</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Khám phá và chọn bộ từ vựng để bắt đầu luyện tập đánh máy.</p>
              </div>
              <div className="flex w-full items-center pb-6">
                <LanguageTabSwitcher />
              </div>
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="mr-4 flex flex-1 flex-col items-start justify-start gap-14 overflow-y-auto">
                  {groupedByCategoryAndTag.map(([category, groupeByTag]) => (
                    <DictionaryGroup key={category} groupedDictsByTag={groupeByTag} />
                  ))}
                </div>
              </ScrollArea>
              {/* todo: Thêm điều hướng */}
              {/* <div className="mt-20 h-40 w-40 text-center ">
                <CategoryNavigation />
              </div> */}
            </div>
          </div>
        </div>
      </GalleryContext.Provider>
    </Layout>
  )
}
