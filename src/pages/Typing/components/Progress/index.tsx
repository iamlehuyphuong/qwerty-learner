import { TypingContext } from '../../store'
import { useContext, useEffect, useState } from 'react'

export default function Progress({ className }: { className?: string }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const colorSwitcher: { [key: number]: string } = {
    0: 'bg-indigo-500 dark:bg-indigo-500',
    1: 'bg-indigo-600 dark:bg-indigo-600',
    2: 'bg-indigo-700 dark:bg-indigo-700',
  }

  useEffect(() => {
    const newProgress = Math.floor((state.chapterData.index / state.chapterData.words.length) * 100)
    setProgress(newProgress)
    const colorPhase = Math.floor(newProgress / 33.4)
    setPhase(colorPhase)
  }, [state.chapterData.index, state.chapterData.words.length])

  return (
    <div className={`relative w-1/4 pt-1 ${className}`}>
      <div className="flex h-2 overflow-hidden rounded-xl border border-slate-200 bg-transparent text-xs transition-all duration-300 dark:border-slate-700">
        <div
          style={{ width: `${progress}%` }}
          className={`flex flex-col justify-center whitespace-nowrap rounded-xl text-center text-white shadow-none transition-all duration-300 ${
            colorSwitcher[phase] ?? 'bg-indigo-500 dark:bg-indigo-500'
          }`}
        ></div>
      </div>
    </div>
  )
}
