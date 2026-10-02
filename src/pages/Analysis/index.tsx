import HeatmapCharts from './components/HeatmapCharts'
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts'
import LineCharts from './components/LineCharts'
import { useWordStats } from './hooks/useWordStats'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { isOpenDarkModeAtom } from '@/store'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { X } from 'lucide-react'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'

const Analysis = () => {
  const navigate = useNavigate()
  const [, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old)
  }

  useHotkeys(
    'ctrl+d',
    () => {
      changeDarkModeState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } = useWordStats(
    dayjs().subtract(1, 'year').unix(),
    dayjs().unix(),
  )

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col overflow-y-auto px-8 pt-10">
        <div className="relative mb-8">
          <h1 className="text-center text-2xl font-bold text-foreground">Báo cáo thống kê</h1>
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2" onClick={onBack}>
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        <ScrollArea className="[&>div>div]:block! flex-1">
          <div className="flex justify-center pb-40">
            <div className="inline-flex flex-col gap-6">
              {isEmpty ? (
                <div className="grid h-60 place-content-center">
                  <p className="text-lg text-muted-foreground">Chưa có dữ liệu luyện tập</p>
                </div>
              ) : (
                <>
                  <Card className="overflow-hidden">
                    <CardContent className="px-6 pb-4 pt-6">
                      <HeatmapCharts title="Thời gian luyện tập" data={exerciseRecord} />
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <CardContent className="px-6 pb-4 pt-6">
                      <HeatmapCharts title="Số từ đã luyện tập" data={wordRecord} unit="từ" />
                    </CardContent>
                  </Card>
                  <Card className="h-96 overflow-hidden">
                    <CardContent className="h-full px-6 pb-4 pt-6">
                      <LineCharts title="Xu hướng tốc độ gõ (WPM)" name="WPM" data={wpmRecord} />
                    </CardContent>
                  </Card>
                  <Card className="h-96 overflow-hidden">
                    <CardContent className="h-full px-6 pb-4 pt-6">
                      <LineCharts title="Xu hướng độ chính xác" name="Tỷ lệ chính xác (%)" data={accuracyRecord} suffix="%" />
                    </CardContent>
                  </Card>
                  <Card className="h-96 overflow-hidden">
                    <CardContent className="h-full px-6 pb-4 pt-6">
                      <KeyboardWithBarCharts title="Phân bố lỗi gõ phím" name="Số lỗi" data={wrongTimeRecord} />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  )
}

export default Analysis
