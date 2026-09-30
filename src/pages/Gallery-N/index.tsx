import DictionaryGroup from './CategoryDicts'
import { LanguageTabSwitcher } from './LanguageTabSwitcher'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { dictionaries } from '@/resources/dictionary'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary, LanguageCategoryType } from '@/typings'
import groupBy, { groupByDictTags } from '@/utils/groupBy'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtomValue } from 'jotai'
import { Info, X } from 'lucide-react'
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
              <ScrollArea.Root className="flex-1 overflow-y-auto">
                <ScrollArea.Viewport className="h-full w-full ">
                  <div className="mr-4 flex flex-1 flex-col items-start justify-start gap-14 overflow-y-auto">
                    {groupedByCategoryAndTag.map(([category, groupeByTag]) => (
                      <DictionaryGroup key={category} groupedDictsByTag={groupeByTag} />
                    ))}
                  </div>
                  <div className="flex items-center justify-center pb-10 pt-[20rem] text-gray-500">
                    <Info className="mr-1 h-5 w-5 flex-shrink-0" />
                    <p className="mr-5 w-10/12 text-xs">
                      Dữ liệu từ điển của dự án này được tổng hợp miễn phí từ nhiều dự án mã nguồn mở và các thành viên đóng góp trong cộng
                      đồng. Chúng tôi đánh giá cao và tôn trọng quyền sở hữu trí tuệ của những người đóng góp. Dữ liệu này chỉ dành cho mục
                      đích nghiên cứu và học tập cá nhân, nghiêm cấm mọi hành vi sử dụng cho mục đích thương mại. Nếu bạn là chủ sở hữu bản
                      quyền của bất kỳ dữ liệu nào và cho rằng việc sử dụng của chúng tôi vi phạm quyền của bạn, vui lòng liên hệ với chúng
                      tôi qua email ở cuối trang web. Sau khi nhận được khiếu nại bản quyền hợp lệ, chúng tôi sẽ gỡ bỏ nội dung liên quan
                      hoặc xin cấp quyền sớm nhất có thể. Đồng thời, chúng tôi cũng khuyến khích người dùng tôn trọng quyền tác giả và tuân
                      thủ tất cả các luật và quy định hiện hành khi sử dụng dữ liệu. Xin lưu ý: Mặc dù chúng tôi đã cố gắng hết sức để đảm
                      bảo tính hợp pháp và độ chính xác của dữ liệu, chúng tôi không thể cam kết tính tuyệt đối chính xác, nguyên vẹn hay độ
                      tin cậy của chúng. Việc sử dụng dữ liệu này hoàn toàn do người dùng tự chịu rủi ro.
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
