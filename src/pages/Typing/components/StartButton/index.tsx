import { TypingContext, TypingStateActionType } from '../../store'
import Tooltip from '@/components/Tooltip'
import { Button } from '@/components/ui/button'
import { randomConfigAtom } from '@/store'
import { autoUpdate, offset, useFloating, useHover, useInteractions } from '@floating-ui/react'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export default function StartButton({ isLoading }: { isLoading: boolean }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!
  const randomConfig = useAtomValue(randomConfigAtom)

  const onToggleIsTyping = useCallback(() => {
    !isLoading && dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING })
  }, [isLoading, dispatch])

  const onClickRestart = useCallback(() => {
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, randomConfig.isOpen])

  useHotkeys('enter', onToggleIsTyping, { enableOnFormTags: true, preventDefault: true }, [onToggleIsTyping])

  const [isShowReStartButton, setIsShowReStartButton] = useState(false)
  const { refs, context } = useFloating({
    open: isShowReStartButton,
    onOpenChange: setIsShowReStartButton,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5)],
  })
  const hoverButton = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hoverButton])

  return (
    <Tooltip content={`${state.isTyping ? 'Tạm dừng' : 'Bắt đầu'} (Enter)`} className="box-content h-10 w-32">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`absolute left-0 top-0 flex w-32 flex-col items-center gap-1 rounded-lg transition-all duration-200`}
      >
        <Button
          variant={state.isTyping ? 'secondary' : 'default'}
          className={`${
            state.isTyping
              ? 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-500'
          } h-10 w-32 rounded-lg border text-sm font-medium transition-colors`}
          type="button"
          onClick={onToggleIsTyping}
          aria-label={state.isTyping ? 'tạm dừng' : 'bắt đầu'}
        >
          {state.isTyping ? 'Tạm dừng' : 'Bắt đầu'}
        </Button>
        {isShowReStartButton && (
          <div className="flex w-32 justify-center" ref={refs.setFloating} {...getFloatingProps()}>
            <Button
              variant="default"
              className="h-9 w-28 rounded-lg border border-indigo-500 bg-indigo-600/80 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              type="button"
              onClick={onClickRestart}
              aria-label={'Chơi lại'}
            >
              Chơi lại
            </Button>
          </div>
        )}
      </div>
    </Tooltip>
  )
}
