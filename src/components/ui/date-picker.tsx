'use client'

import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import * as React from 'react'

export interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, onSelect, placeholder = 'Pick a date', className = '' }: DatePickerProps) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`focus:ring-brand-500 flex h-10 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            !date ? 'text-muted-foreground' : ''
          } ${className}`}
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
            {date ? formatDate(date) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="left" className="w-auto p-0">
        <Calendar selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  )
}
