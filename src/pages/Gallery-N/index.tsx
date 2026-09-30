import DictionaryGroup from './CategoryDicts'
import DictRequest from './DictRequest'
import { LanguageTabSwitcher } from './LanguageTabSwitcher'
import Layout from '@/components/Layout'
import { dictionaries } from '@/resources/dictionary'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary, LanguageCategoryType } from '@/typings'
import groupBy, { groupByDictTags } from '@/utils/groupBy'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtomValue } from 'jotai'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'
import IconInfo from '~icons/ic/outline-info'
import IconX from '~icons/tabler/x'

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
        <div className="relative mb-auto mt-auto flex w-full flex-1 flex-col overflow-y-auto pl-20">
          <IconX className="absolute right-20 top-10 mr-2 h-7 w-7 cursor-pointer text-gray-400" onClick={onBack} />
          <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
            <div className="flex h-full flex-col overflow-y-auto">
              <div className="flex h-20 w-full items-center justify-between pb-6 pr-20">
                <LanguageTabSwitcher />
                <DictRequest />
              </div>
              <ScrollArea.Root className="flex-1 overflow-y-auto">
                <ScrollArea.Viewport className="h-full w-full ">
                  <div className="mr-4 flex flex-1 flex-col items-start justify-start gap-14 overflow-y-auto">
                    {groupedByCategoryAndTag.map(([category, groupeByTag]) => (
                      <DictionaryGroup key={category} groupedDictsByTag={groupeByTag} />
                    ))}
                  </div>
                  <div className="flex items-center justify-center pb-10 pt-[20rem] text-gray-500">
                    <IconInfo className="mr-1 h-5 w-5" />
                    <p className="mr-5 w-10/12 text-xs">
                      本dự áncủatừ điểndữ liệu来自nhiều个Nguồn mởdự án以及cộng tác viên cộng đồngcủa无偿提供。Chúng tôi đánh giá cao và tôn
                      trọng quyền sở hữu trí tuệ của mọi người đóng góp。 Dữ liệu này chỉ dành cho mục đích nghiên cứu và học tập cá
                      nhân，Mọi mục đích thương mại đều bị nghiêm cấm。nếu như你是dữ liệucủa版权所有者，và tin rằng việc sử dụng của chúng
                      tôi vi phạm quyền của bạn，Vui lòng liên hệ với chúng tôi qua email ở cuối trang web。Sau khi nhận được khiếu nại bản
                      quyền hợp lệ，Chúng tôi sẽ xóa nội dung liên quan hoặc tìm kiếm các quyền cần thiết càng sớm càng tốt。 cùng
                      lúc，Chúng tôi cũng khuyến khích mọi người sử dụng dữ liệu này tôn trọng quyền của chủ sở hữu bản quyền，và tuân thủ
                      tất cả các luật và quy định có liên quan khi sử dụng dữ liệu này。 xin lưu ý，Mặc dù chúng tôi cố gắng hết sức để đảm
                      bảo tính hợp pháp và chính xác của tất cả dữ liệu，Tuy nhiên, chúng tôi không thể đảm bảo tính chính xác của bất kỳ dữ
                      liệu nào、chính trực、không đảm bảo tính hợp pháp hoặc độ tin cậy。Việc sử dụng dữ liệu này hoàn toàn do người dùng tự
                      chịu rủi ro。
                    </p>
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
              </ScrollArea.Root>
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
