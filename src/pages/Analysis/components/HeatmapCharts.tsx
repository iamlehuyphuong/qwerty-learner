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
}

const HeatmapCharts: FC<HeatmapChartsProps> = ({ data, title }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center text-xl font-bold text-gray-600	dark:text-white">{title}</div>
      <ActivityCalendar
        fontSize={20}
        blockSize={22}
        blockRadius={7}
        style={{
          padding: '40px 60px 20px 100px',
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
            'data-tooltip-html': `${activity.date} luyện tập ${activity.count} hạng hai`,
          })
        }
        showWeekdayLabels={true}
        labels={{
          months: [
            'Tháng Một',
            'Tháng hai',
            'Bước đều',
            'Tháng tư',
            'Có thể',
            'Tháng sáu',
            'Tháng bảy',
            'Tháng tám',
            'Tháng 9',
            'tháng mười',
            'Tháng mười một',
            'Tháng 12',
          ],
          weekdays: ['ngày', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu'],
          totalCount: 'Tổng cộng trong năm qua {{count}} hạng hai',
          legend: {
            less: 'một vài',
            more: 'nhiều',
          },
        }}
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  )
}

export default HeatmapCharts
