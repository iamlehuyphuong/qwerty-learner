import noop from '../../utils/noop'
import { hasSeenEnhancedPromotionAtom } from '@/store'
import { trackPromotionEvent } from '@/utils/trackEvent'
import { Dialog, Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import type React from 'react'
import { Fragment, useEffect, useState } from 'react'
import IconStar from '~icons/heroicons/star-solid'
import IconX from '~icons/tabler/x'

const EnhancedPromotionModal: React.FC = () => {
  const [hasSeenPromotion, setHasSeenPromotion] = useAtom(hasSeenEnhancedPromotionAtom)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Only show modal if user hasn't seen it before
    if (!hasSeenPromotion) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000) // Show after 2 seconds to let the page load

      return () => clearTimeout(timer)
    }
  }, [hasSeenPromotion])

  const handleTryNow = () => {
    trackPromotionEvent('promotion_event', {
      from: 'promotion_modal',
      action: 'open',
      action_detail: 'promotion_modal_open',
    })
    setHasSeenPromotion(true)
    setIsOpen(false)
  }

  const handleDismiss = () => {
    trackPromotionEvent('promotion_event', {
      from: 'promotion_modal',
      action: 'close',
      action_detail: 'promotion_modal_close',
    })
    setHasSeenPromotion(true)
    setIsOpen(false)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={noop}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl border border-blue-200 bg-white p-0 text-left shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-xl">
                {/* Header with close button */}
                <div className="absolute right-4 top-4 z-10">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Đóng"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 pt-10">
                  {/* Icon and title */}
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                      <IconStar className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                      Chào mừng tới {import.meta.env.VITE_APP_NAME || 'Type & English'}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Nâng cao hiệu suất luyện gõ và học từ vựng ✨</p>
                  </div>

                  {/* Main content */}
                  <div className="space-y-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="text-center font-medium text-gray-900 dark:text-white">
                      Bạn muốn ghi nhớ từ vựng tự nhiên mà không khô khan?
                      <br />
                      <span className="my-2 block"></span>
                      Sự kết hợp hoàn hảo giữa luyện gõ phím và học tiếng Anh giúp bạn hình thành phản xạ cơ bắp, ghi nhớ từ vựng sâu hơn.
                    </p>

                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">🚀 Tính năng nổi bật</h4>
                      <ul className="space-y-2.5">
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 text-blue-500">•</span>
                          <span>
                            <strong>Phương pháp học kép</strong> - Vừa tăng tốc độ gõ phím, vừa mở rộng vốn từ vựng.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 text-blue-500">•</span>
                          <span>
                            <strong>Thư viện đa dạng</strong> - Hàng chục bộ từ vựng chuyên ngành: TOEIC, IELTS, Lập trình...
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 text-blue-500">•</span>
                          <span>
                            <strong>Phát âm chuẩn xác</strong> - Nghe phát âm quốc tế để luyện kỹ năng nghe (Dictation).
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 text-blue-500">•</span>
                          <span>
                            <strong>Hoàn toàn miễn phí</strong> - Trải nghiệm mượt mà, không quảng cáo và không thu phí.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-8 space-y-3">
                    <button
                      type="button"
                      onClick={handleTryNow}
                      className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      🚀 Bắt đầu luyện tập
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default EnhancedPromotionModal
