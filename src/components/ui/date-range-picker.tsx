'use client'

import type { DateRange } from './calendar'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import type * as React from 'react'

export interface DateRangePickerProps {
  date?: DateRange
  onSelect?: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
  popoverClassName?: string
  popoverStyle?: React.CSSProperties
  triggerStyle?: React.CSSProperties
  presets?: { label: string; date: DateRange }[]
}

export function DateRangePicker({
  date,
  onSelect,
  placeholder = 'Pick a date range',
  className = '',
  popoverClassName = '',
  popoverStyle,
  triggerStyle,
  presets,
}: DateRangePickerProps) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const displayDate = () => {
    if (date?.from) {
      if (date.to) {
        return `${formatDate(date.from)} - ${formatDate(date.to)}`
      }
      return formatDate(date.from)
    }
    return placeholder
  }

  const hasBg = className.includes('bg-')
  const bgClass = hasBg ? '' : 'bg-card'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`flex h-10 w-full items-center justify-between rounded-md border border-border ${bgClass} focus:ring-brand-500 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            !date?.from ? 'text-muted-foreground' : ''
          } ${className}`}
          style={triggerStyle}
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {displayDate()}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="left" className={`flex w-auto p-0 ${popoverClassName}`} style={popoverStyle}>
        {presets && presets.length > 0 && (
          <div className="flex min-w-[130px] flex-col gap-1 border-r border-border p-3 pr-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  if (onSelect) onSelect(preset.date)
                  // Close popover logic would go here if we managed open state
                }}
                className="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        <div className="p-0">
          <Calendar mode="range" numberOfMonths={2} selected={date} onSelect={onSelect} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
