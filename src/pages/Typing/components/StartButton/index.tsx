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
    <Tooltip content={`${state.isTyping ? 'Tạm dừng' : 'Bắt đầu'} (Enter)`} className="box-content h-7 w-24 px-4 py-1">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`${
          state.isTyping
            ? 'bg-gray-400 shadow-gray-200 dark:bg-gray-600  dark:shadow-none'
            : 'bg-indigo-500 shadow-indigo-300 dark:shadow-indigo-500/60'
        } ${
          isShowReStartButton ? 'h-20' : 'h-auto'
        } flex-column absolute left-0 top-0 w-32 rounded-lg shadow-lg transition-colors duration-200`}
      >
        <Button
          variant={state.isTyping ? 'secondary' : 'default'}
          className={`${
            state.isTyping ? 'bg-gray-400  dark:bg-gray-700 dark:hover:bg-gray-500' : 'bg-indigo-500'
          } h-10 w-32 transform rounded-lg shadow transition-all hover:-translate-y-0.5`}
          type="button"
          onClick={onToggleIsTyping}
          aria-label={state.isTyping ? 'tạm dừng' : 'bắt đầu'}
        >
          <span className="font-medium">{state.isTyping ? 'Tạm dừng' : 'Bắt đầu'}</span>
        </Button>
        {isShowReStartButton && (
          <div className="absolute bottom-0 flex w-32 justify-center" ref={refs.setFloating} {...getFloatingProps()}>
            <Button
              variant={state.isTyping ? 'secondary' : 'default'}
              className={`${
                state.isTyping ? 'bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-500 ' : 'bg-indigo-400 '
              } mb-1 mt-1 h-10 w-28 transform rounded-lg transition-colors duration-200 hover:-translate-y-0.5`}
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
