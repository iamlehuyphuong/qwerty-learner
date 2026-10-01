import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import { Button } from '@/components/ui/button'
import { isShowHandPositionAtom } from '@/store'
import { useAtom, useAtomValue } from 'jotai'
import { Keyboard } from 'lucide-react'

export default function HandPositionIllustration() {
  const [isShow, setIsShow] = useAtom(isShowHandPositionAtom)
  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-8 w-8 transition-colors ${
        isShow ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-500 dark:border-gray-700'
      }`}
      onClick={(e) => {
        setIsShow(!isShow)
        e.currentTarget.blur()
      }}
    >
      <Keyboard className={`h-5 w-5 ${isShow ? '' : 'opacity-50'}`} />
    </Button>
  )
}

export function HandPositionImage() {
  const isShow = useAtomValue(isShowHandPositionAtom)
  if (!isShow) return null
  return (
    <div className="pointer-events-none flex w-full select-none justify-center opacity-80 transition-all duration-300">
      <img
        className="block h-48 max-w-[90%] object-contain lg:h-56 lg:max-w-[700px]"
        src={standTypingHandPosition}
        alt="Standard typing hand position"
      />
    </div>
  )
}
