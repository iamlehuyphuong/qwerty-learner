import { TypingContext } from '../../store'
import shareImage1 from '@/assets/sharePic/image-1.png'
import shareImage2 from '@/assets/sharePic/image-2.png'
import shareImage3 from '@/assets/sharePic/image-3.png'
import shareImage4 from '@/assets/sharePic/image-4.png'
import shareImage5 from '@/assets/sharePic/image-5.png'
import shareImage6 from '@/assets/sharePic/image-6.png'
import shareImage7 from '@/assets/sharePic/image-7.png'
import shareImage8 from '@/assets/sharePic/image-8.png'
import shareImage9 from '@/assets/sharePic/image-9.png'
import keyboardSvg from '@/assets/sharePic/keyBackground.svg'
import { currentChapterAtom, currentDictInfoAtom } from '@/store'
import { recordShareAction } from '@/utils'
import { Dialog, Transition } from '@headlessui/react'
import { useAtomValue } from 'jotai'
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import IconXMark from '~icons/heroicons/x-mark-solid'

const PIC_RATIO = 3
const PIC_LIST = [shareImage1, shareImage2, shareImage3, shareImage4, shareImage5, shareImage6, shareImage7, shareImage8, shareImage9]
const PROMOTE_LIST = [
  { word: 'Gõ Như Bay', sentence: 'Tốc độ gõ phím lướt đi như gió, không gì cản bước!' },
  { word: 'Nhanh Như Chớp', sentence: 'Tốc độ gõ phím cực nhanh, như một tia sét lóe lên.' },
  { word: 'Tuyệt Đỉnh', sentence: 'Độ chính xác và tốc độ gõ hoàn hảo ở mọi góc độ.' },
  { word: 'Vô Đối', sentence: 'Tốc độ đánh máy xuất thần, hoàn toàn không có đối thủ.' },
  { word: 'Siêu Phàm', sentence: 'Bàn tay lướt trên phím mượt mà như một khúc nhạc.' },
  { word: 'Thánh Gõ', sentence: 'Trình độ thượng thừa, gõ phím mà cứ ngỡ như đang múa.' },
  { word: 'Chính Xác', sentence: 'Không chỉ gõ nhanh mà còn chuẩn xác đến từng ký tự.' },
  { word: 'Đỉnh Cao', sentence: 'Sự kết hợp hoàn hảo giữa tốc độ và phản xạ cơ bắp.' },
]

export type SharePicDialogProps = {
  showState: boolean
  setShowState: (showState: boolean) => void
  randomChoose: {
    picRandom: number
    promoteRandom: number
  }
}

export default function SharePicDialog({ showState, setShowState, randomChoose }: SharePicDialogProps) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const imageRef = useRef<HTMLDivElement>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentChapter = useAtomValue(currentChapterAtom)

  const dialogFocusRef = useRef<HTMLButtonElement>(null)

  const shareImage = useMemo(() => PIC_LIST[Math.floor(randomChoose.picRandom * PIC_LIST.length)], [randomChoose.picRandom])
  const promote = useMemo(() => PROMOTE_LIST[Math.floor(randomChoose.promoteRandom * PROMOTE_LIST.length)], [randomChoose.promoteRandom])

  useEffect(() => {
    async function loadToPng() {
      const { toPng } = await import('html-to-image')

      if (imageRef.current) {
        const width = imageRef.current.offsetWidth
        const height = imageRef.current.offsetHeight
        toPng(imageRef.current, { canvasWidth: width * PIC_RATIO, canvasHeight: height * PIC_RATIO }).then((url) => {
          setImageURL(url)
        })
      }
    }

    loadToPng()
  }, [])

  const handleDownload = useCallback(async () => {
    const { saveAs } = await import('file-saver')

    if (imageURL) {
      saveAs(imageURL, 'Qwerty-learner.png')
      recordShareAction('download')
    }
  }, [imageURL])

  const handleClose = useCallback(() => {
    setShowState(false)
  }, [setShowState])

  return (
    <>
      <Transition.Root show={showState}>
        <Dialog as="div" className="relative z-50" onClose={handleClose} initialFocus={dialogFocusRef}>
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
                <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all dark:bg-gray-800">
                  <div className="flex flex-col items-center justify-center px-10 pb-10 pt-16">
                    <button
                      className="absolute right-5 top-5 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      type="button"
                      onClick={handleClose}
                      title="Đóng"
                    >
                      <IconXMark className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="w-full max-w-[480px]">
                      {imageURL ? (
                        <img src={imageURL} className="h-auto w-full rounded-xl border border-gray-200 shadow-md dark:border-gray-700" />
                      ) : (
                        <div className="flex aspect-[480/580] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <svg
                            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-50" cx="12" cy="12" r="10" stroke="rgb(129 140 248)" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      ref={dialogFocusRef}
                      className="mt-8 flex h-12 w-full max-w-[300px] items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                      type="button"
                      onClick={handleDownload}
                      title="Lưu ảnh"
                    >
                      🚀 Tải ảnh về máy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div style={{ position: 'absolute', left: '-999px', zIndex: -1 }}>
        <div ref={imageRef} className="box-content w-[480px] bg-white p-6">
          <div className="relative flex h-[580px] w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-indigo-50 bg-[#F8F8FF] shadow-xl">
            <div className="relative z-10 w-full">
              <KeyboardPanel description={promote.word} />
              <div className="mt-6 px-8 text-center text-[15px] font-medium text-gray-600">{promote.sentence}</div>
              <div className="mx-6 mt-8 flex rounded-2xl bg-white px-4 py-4 shadow-lg ring-1 ring-black/5">
                <DataBox data={state.timerData.time + ''} description="Thời gian" />
                <DataBox data={state.timerData.accuracy + '%'} description="Độ chính xác" />
                <DataBox data={state.timerData.wpm + ''} description="WPM" />
              </div>

              <div className="mt-6 text-center text-xl font-bold text-gray-800">{currentDictInfo.name}</div>
              <div className="mt-1 text-center text-sm font-bold text-indigo-500">{`Bài ${currentChapter + 1}`}</div>
            </div>

            <div className="relative z-10 mb-6 mt-auto flex w-full flex-col items-center">
              <div className="text-sm font-black tracking-tight text-gray-900">{import.meta.env.VITE_APP_NAME || 'Type & English'}</div>
              <div className="mt-1 text-xs font-medium text-gray-500">Công cụ học từ vựng qua phản xạ cơ bắp</div>
            </div>
            <div className="absolute -right-6 bottom-4 z-0 opacity-90">
              <img src={shareImage} className="w-56" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DataBox({ data, description }: { data: string; description: string }) {
  return (
    <div className="flex w-20 flex-1 flex-col items-center justify-center">
      <span className="w-4/5 text-center text-base font-normal text-gray-600 ">{data}</span>
      <span className="pt-2 text-xs text-gray-400">{description}</span>
    </div>
  )
}

function KeyboardPanel({ description }: { description: string }) {
  const normalizedDescription = description
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-1.5 px-4">
      {normalizedDescription.split('').map((char, index) => (
        <KeyboardKey key={`${index}-${char}`} char={char} />
      ))}
    </div>
  )
}

function KeyboardKey({ char }: { char: string }) {
  if (char === ' ') return <div className="w-6" /> // Handle space character

  return (
    <div className="relative h-14 w-14 drop-shadow-md">
      <div className="absolute bottom-0 left-0 right-0 top-0">
        <img src={keyboardSvg} className="h-full w-full object-contain" />
      </div>
      <div className="absolute left-0 right-0 top-1.5 flex items-center justify-center">
        <span className="font-bold text-white shadow-black drop-shadow-sm" style={{ fontSize: '20px', transform: 'rotateX(30deg)' }}>
          {char.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
