import { TypingContext, TypingStateActionType } from '../../store'
import AnalysisButton from '../AnalysisButton'
import ErrorBookButton from '../ErrorBookButton'
import HandPositionIllustration from '../HandPositionIllustration'
import LoopWordSwitcher from '../LoopWordSwitcher'
import Setting from '../Setting'
import SoundSwitcher from '../SoundSwitcher'
import WordDictationSwitcher from '../WordDictationSwitcher'
import Tooltip from '@/components/Tooltip'
import { Button } from '@/components/ui/button'
import { CTRL } from '@/utils'
import { Languages } from 'lucide-react'
import { useContext } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Switcher() {
  const { state, dispatch } = useContext(TypingContext) ?? {}

  const changeTransVisibleState = () => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE })
    }
  }

  useHotkeys(
    'ctrl+shift+v',
    () => {
      changeTransVisibleState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip content="Cài đặt âm thanh">
        <SoundSwitcher />
      </Tooltip>

      <Tooltip content="Lặp lại từ vựng">
        <LoopWordSwitcher />
      </Tooltip>

      <Tooltip content={`Bật/tắt chế độ viết im lặng (${CTRL} + V)`}>
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip content={`Bật/tắt hiển thị nghĩa (${CTRL} + Shift + V)`}>
        <Button
          variant="outline"
          size="icon"
          className={`${
            state?.isTransVisible ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-500 dark:border-gray-700'
          } h-8 w-8 transition-colors`}
          onClick={(e) => {
            changeTransVisibleState()
            e.currentTarget.blur()
          }}
          aria-label={`Bật/tắt hiển thị nghĩa (${CTRL} + Shift + V)`}
        >
          {state?.isTransVisible ? <Languages className="h-5 w-5" /> : <Languages className="h-5 w-5 opacity-50" />}
        </Button>
      </Tooltip>

      <Tooltip content="Sổ tay từ viết sai">
        <ErrorBookButton />
      </Tooltip>

      <Tooltip content="Xem thống kê">
        <AnalysisButton />
      </Tooltip>

      <Tooltip content="Vị trí đặt tay">
        <HandPositionIllustration></HandPositionIllustration>
      </Tooltip>
      <Tooltip content="Cài đặt">
        <Setting />
      </Tooltip>
    </div>
  )
}
