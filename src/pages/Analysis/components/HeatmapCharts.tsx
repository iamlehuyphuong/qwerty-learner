import { isOpenDarkModeAtom } from '@/store'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import React from 'react'
import type { Activity } from 'react-activity-calendar'
import ActivityCalendar from 'react-activity-calendar'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

interface HeatmapChartsProps {
  title: string
  data: Activity[]
  unit?: string
}

const HeatmapCharts: FC<HeatmapChartsProps> = ({ data, title, unit = 'lần' }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-3 text-center text-lg font-semibold text-foreground">{title}</div>
      <ActivityCalendar
        fontSize={16}
        blockSize={18}
        blockRadius={5}
        style={{
          padding: '20px 40px 16px 80px',
          color: isOpenDarkMode ? '#fff' : '#000',
        }}
        colorScheme={isOpenDarkMode ? 'dark' : 'light'}
        data={data}
        theme={{
          light: ['#f0f0f0', '#6366f1'],
          dark: ['hsl(0, 0%, 22%)', '#818cf8'],
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html': activity.count > 0 ? `${activity.date}: ${activity.count} ${unit}` : `${activity.date}: Chưa luyện tập`,
            ...(activity.count === 0
              ? {
                  fill: 'transparent',
                  stroke: isOpenDarkMode ? 'hsl(0, 0%, 25%)' : '#e0e0e0',
                  strokeWidth: 1,
                }
              : {}),
          })
        }
        showWeekdayLabels={true}
        labels={{
          months: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
          weekdays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
          totalCount: `Tổng cộng {{count}} ${unit} trong năm qua`,
          legend: {
            less: 'Ít',
            more: 'Nhiều',
          },
        }}
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  )
}

export default HeatmapCharts
