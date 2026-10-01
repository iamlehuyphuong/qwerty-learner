import { DonatingCard } from '../DonatingCard'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './hooks/useWordStats'
import { Button } from '@/components/ui/button'
import { DONATE_DATE } from '@/constants'
import { reportDonateCard } from '@/utils'
import noop from '@/utils/noop'
import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import type React from 'react'
import { Fragment, useLayoutEffect, useMemo, useState } from 'react'

export const DonateCard = () => {
  const [show, setShow] = useState(false)

  const chapterNumber = useChapterNumber()
  const wordNumber = useWordNumber()
  const sumWrongCount = useSumWrongCount()
  const dayFromFirstWord = useDayFromFirstWordRecord()
  const dayFromQwerty = useMemo(() => {
    const now = dayjs()
    const past = dayjs('2021-01-21')
    return now.diff(past, 'day')
  }, [])

  const HighlightedText = ({ children }: { children: React.ReactNode }) => <span className="font-bold text-indigo-500">{children}</span>

  const onClickHasDonated = () => {
    setShow(false)
    window.localStorage.setItem(DONATE_DATE, dayjs().format())
    try {
      reportDonateCard({
        type: 'donate',
        chapterNumber,
        wordNumber,
        sumWrongCount,
        dayFromFirstWord,
        dayFromQwerty,
        amount: 0,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const onClickRemindMeLater = () => {
    setShow(false)
    try {
      reportDonateCard({
        type: 'dismiss',
        chapterNumber,
        wordNumber,
        sumWrongCount,
        dayFromFirstWord,
        dayFromQwerty,
        amount: 0,
      })
    } catch (e) {
      console.error(e)
    }
  }

  useLayoutEffect(() => {
    if (chapterNumber && chapterNumber !== 0 && chapterNumber % 5 === 0) {
      const now = dayjs()
      const storedDonateDate = window.localStorage.getItem(DONATE_DATE)
      if (storedDonateDate) {
        const diff = now.diff(dayjs(storedDonateDate), 'day')
        if (diff <= 30) return
      }
      setShow(true)
    }
  }, [chapterNumber])

  return (
    <Transition.Root show={show} as={Fragment}>
      {/* z-[60] ensures this renders above ResultScreen's z-50 overlay */}
      <Dialog as="div" className="pointer-events-auto relative z-[60]" onClose={() => noop()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="pointer-events-auto fixed inset-0 z-[70] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg transform select-text rounded-2xl bg-white p-8 shadow-2xl transition-all dark:bg-gray-800 dark:text-gray-200">
                {/* Title */}
                <h1 className="gradient-text mb-6 text-center text-[2rem] font-bold leading-tight">
                  {chapterNumber} Chapters Achievement! 🎉
                </h1>

                {/* Achievement stats */}
                <p className="mb-4 indent-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  Type & English đã đồng hành cùng bạn trong <HighlightedText>{dayFromFirstWord}</HighlightedText> ngày qua. Bạn đã hoàn
                  thành <HighlightedText>{wordNumber}</HighlightedText> lần luyện từ và sửa{' '}
                  <HighlightedText>{sumWrongCount}</HighlightedText> lỗi nhập sai — mỗi lần thực hành là một bước tiến rõ ràng! 🎊
                </p>

                {/* About the app */}
                <p className="mb-4 indent-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-indigo-500">{import.meta.env.VITE_APP_NAME || 'Type & English'}</span> là dự án{' '}
                  <span className="font-medium">hoàn toàn miễn phí và không quảng cáo</span>.
                </p>

                {/* Donation CTA */}
                <p className="mb-6 text-justify indent-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  Để duy trì và cải thiện dịch vụ, chúng tôi cần sự hỗ trợ từ cộng đồng. Nếu ứng dụng hữu ích với bạn, hãy cân nhắc{' '}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">ủng hộ một tách cà phê ☕</span> — dù nhỏ, mỗi đóng
                  góp đều giúp dự án tiếp tục phát triển. Cảm ơn sự hỗ trợ của bạn!
                </p>

                <DonatingCard className="mb-6" />

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onClickRemindMeLater}
                    className="dark:border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    Hẹn gặp lại lần sau
                  </Button>
                  <Button variant="default" type="button" onClick={onClickHasDonated}>
                    Đã ủng hộ rồi ❤️
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
