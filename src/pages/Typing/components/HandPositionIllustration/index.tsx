import DynamicKeyboard from './DynamicKeyboard'
import { Button } from '@/components/ui/button'
import { isShowHandPositionAtom } from '@/store'
import { useAtom } from 'jotai'
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
  return <DynamicKeyboard />
}
