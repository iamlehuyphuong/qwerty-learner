import InfoPanel from '@/components/InfoPanel'
import { trackPromotionEvent } from '@/utils/trackEvent'
import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
    trackPromotionEvent('promotion_event', {
      from: 'dict_request_button',
      action: 'open',
      action_detail: 'dict_request_button_open',
    })
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
    trackPromotionEvent('promotion_event', {
      from: 'dict_request_panel',
      action: 'close',
      action_detail: 'dict_request_panel_close',
    })
  }, [])

  return (
    <>
      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="Muốn thêm nhiều từ điển？"
          icon={IconBook2}
          buttonClassName="bg-indigo-500 hover:bg-indigo-400"
          iconClassName="text-indigo-500 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500"
          onClose={onClosePanel}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            nếu như您具Chuẩn bịmột定của编程技能，Chào mừng bạn đến tham khảo của chúng tôi
            <a
              href="https://github.com/RealKai42/qwerty-learner/blob/master/docs/toBuildDict.md"
              className="mx-1 font-medium text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              Nguyên tắc đóng góp từ điển
            </a>
            ，theo照指引vìNguồn mởdự án贡献mớitừ điển内容。Chúng tôi rất hoan nghênh sự đóng góp của cộng đồng！
          </p>

          {/* 
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm dark:from-gray-800 dark:to-gray-700">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">🚀 thử QwertyLearner.ai</h4>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                Không thể lập trình？Muốn có từ điển học tập độc quyền của riêng bạn？Dễ dàng vận hành，Tải lên bằng một cú nhấp chuột，Bấm và chơi
                <br />
                <div className="my-2"></div>
                Vì thế，Đề nghị bạn thử bởi người Anh DeepLearningAI Được phát triển và vận hành bởi đội ngũ chuyên nghiệp
                <span className="mx-1 font-semibold text-blue-600 dark:text-blue-400">QwertyLearner.ai</span>
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>AI Từ vựng thông minh</strong> - Tải lên bằng một cú nhấp chuột，Tạo thông minh các định nghĩa và các phần của lời nói，Tạo thư viện từ vựng tùy chỉnh độc quyền
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>bài tập bài viết</strong> - Tùy chỉnh nội dung bài viết，Nâng cao năng lực thực hành
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Đồng bộ đám mây</strong> - Ghi âm thực hành đa thiết bị、Đồng bộ hóa ngân hàng câu hỏi sai
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Lựa chọn từ điển</strong> - Từ vựng chuyên nghiệp phong phú hơn
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.open('https://qwertylearner.ai', '_blank')
                  onClosePanel()
                }}
                className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                🚀 kinh nghiệm QwertyLearner.ai
              </button>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                <strong>minh họa：</strong>QwertyLearner.ai bởi người Anh DeepLearningAI Phát triển và vận hành độc lập，vìNguồn mở版 QwertyLearner
                một dẫn xuất độc lập của，Nguồn mở版Sẽ持续维持Nguồn mở与开放运营。
              </p>
            </div>
            */}
        </InfoPanel>
      )}
      <button
        type="button"
        onClick={onOpenPanel}
        className="group flex items-center space-x-2 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:from-indigo-100 hover:to-blue-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-indigo-400 dark:from-gray-800 dark:to-gray-700 dark:text-indigo-400 dark:hover:from-gray-700 dark:hover:to-gray-600"
      >
        <IconBook2 className="h-4 w-4" />
        <span>Tìm thêm từ điển</span>
        <span className="transform transition-transform group-hover:translate-x-1">✨</span>
      </button>
    </>
  )
}
