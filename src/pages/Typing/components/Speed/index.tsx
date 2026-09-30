import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { Card } from '@/components/ui/card'
import { useContext } from 'react'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <Card className="flex w-3/5 rounded-xl p-4 py-10 opacity-50 transition-colors duration-300">
      <InfoBox info={`${minutesString}:${secondsString}`} description="Thời gian" />
      <InfoBox info={inputNumber + ''} description="Số từ" />
      <InfoBox info={state.timerData.wpm + ''} description="Từ/Phút" />
      <InfoBox info={state.chapterData.correctCount + ''} description="Số từ đúng" />
      <InfoBox info={state.timerData.accuracy + ''} description="Tỉ lệ chính xác" />
    </Card>
  )
}
