import type { AmountType } from '../DonatingCard'
import { DonatingCard } from '../DonatingCard'
import { StickerButton } from '../DonatingCard/components/StickerButton'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './hooks/useWordStats'
import { DONATE_DATE } from '@/constants'
import { reportDonateCard } from '@/utils'
import noop from '@/utils/noop'
import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import type React from 'react'
import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import IconParty from '~icons/logos/partytown-icon'

export const DonateCard = () => {
  const [show, setShow] = useState(false)
  const [amount, setAmount] = useState<AmountType | undefined>(undefined)

  const chapterNumber = useChapterNumber()
  const wordNumber = useWordNumber()
  const sumWrongCount = useSumWrongCount()
  const dayFromFirstWord = useDayFromFirstWordRecord()
  const dayFromQwerty = useMemo(() => {
    const now = dayjs()
    const past = dayjs('2021-01-21')
    return now.diff(past, 'day')
  }, [])

  const HighlightedText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <span className={`font-bold  ${className ? className : 'text-indigo-500'}`}>{children}</span>
  }

  const onClickHasDonated = () => {
    reportDonateCard({
      type: 'donate',
      chapterNumber,
      wordNumber,
      sumWrongCount,
      dayFromFirstWord,
      dayFromQwerty,
      amount: amount ?? 0,
    })

    setShow(false)
    const now = dayjs()
    window.localStorage.setItem(DONATE_DATE, now.format())
  }

  const onClickRemindMeLater = () => {
    reportDonateCard({
      type: 'dismiss',
      chapterNumber,
      wordNumber,
      sumWrongCount,
      dayFromFirstWord,
      dayFromQwerty,
      amount: amount ?? 0,
    })

    setShow(false)
  }

  const onAmountChange = (amount: AmountType) => {
    setAmount(amount)
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
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          noop()
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative my-8 w-[37rem] transform select-text overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                <div className="flex w-full flex-col justify-center gap-4 bg-white px-2 pb-4 pt-5 dark:bg-gray-800 dark:text-gray-300">
                  <h1 className="gradient-text w-full pt-3 text-center text-[2.4rem] font-bold">{`${chapterNumber} Chapters Achievement !`}</h1>
                  <div className="flex w-full flex-col gap-4 px-4">
                    <p className="mx-auto px-4 indent-4">
                      {import.meta.env.VITE_APP_NAME || 'Type & English'} Đã đồng hành cùng bạn trong suốt cuộc hành trình
                      <HighlightedText> {dayFromFirstWord} </HighlightedText>bầu trời，Cùng nhau thực hiện
                      <HighlightedText> {wordNumber} </HighlightedText>
                      luyện từ，Đã sửa cho bạn <HighlightedText> {sumWrongCount} </HighlightedText>
                      đầu vào sai。mọi thực hành，Đó là tất cả bằng chứng cho thấy bạn đang tiến bộ hơn
                      <IconParty className="ml-2 inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <br />
                    </p>
                    <p className="mx-auto px-4 indent-4 font-bold">
                      {import.meta.env.VITE_APP_NAME || 'Type & English'} kiên trì{' '}
                      <span className="font-medium ">Nguồn mở、Không có quảng cáo、Không thương mại hóa</span> đã
                      <HighlightedText className="text-indigo-500"> {dayFromQwerty} </HighlightedText>bầu trời。
                    </p>
                    <p className="mx-auto px-4 indent-4">
                      Khi ngày càng có nhiều sinh viên tham gia，Chi phí máy chủ và bảo trì cũng ngày càng tăng，
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        Hiện tại, chi phí vận hành của dự án vẫn do cá nhân chủ đầu tư chịu.，Qwerty Sự hoạt động lâu dài của công ty cần sự
                        giúp đỡ của bạn
                      </span>
                      。nếu như Qwerty hữu ích cho việc học tập của bạn，Rất mong các bạn cân nhắc quyên góp để ủng hộ chúng tôi——Dù chỉ
                      bằng giá một tách cà phê，tất cả đều có thể giúp đỡ Qwerty Tiếp tục đồng hành cùng nhiều học viên hơn nữa để trưởng
                      thành。
                    </p>
                    <p className="mx-auto px-4 indent-4 ">
                      Để cảm ơn sự hào phóng của bạn，Đơn 50 rmb Đóng góp từ và cao hơn， Chúng tôi sẽ trả lại Qwerty dán tùy chỉnh 5 miếng
                      <span className="text-xs">（Chỉ có Trung Quốc đại lục）</span>，Tôi hy vọng bạn có thể chia sẻ hạnh phúc của mình với
                      bạn bè
                    </p>
                    <div className="flex items-center justify-center">
                      <StickerButton />
                    </div>
                  </div>

                  <DonatingCard className="mt-2" onAmountChange={onAmountChange} />
                  <div className="flex w-full justify-between  px-14 pb-3 pt-0">
                    <button
                      type="button"
                      className={`my-btn-primary ${!amount && 'invisible'} w-36 bg-amber-500 font-medium transition-all`}
                      onClick={onClickHasDonated}
                    >
                      tôi đã quyên góp
                    </button>
                    <button type="button" className="my-btn-primary w-36 font-medium" onClick={onClickRemindMeLater}>
                      Hẹn gặp lại lần sau
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
