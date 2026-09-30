'use client'

import * as React from 'react'

export type DateRange = {
  from?: Date
  to?: Date
}

export type CalendarProps = {
  className?: string
  mode?: 'single' | 'range'
  numberOfMonths?: number
  selected?: any // Date | DateRange
  onSelect?: (date: any) => void
  month?: Date
  onMonthChange?: (month: Date) => void
  locale?: string
  monthNames?: string[]
  dayNames?: string[]
}

export function Calendar({
  className = '',
  mode = 'single',
  numberOfMonths = 1,
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  locale = 'en-US',
  monthNames,
  dayNames,
}: CalendarProps) {
  const [displayMonths, setDisplayMonths] = React.useState<Date[]>(() => {
    const baseDate = controlledMonth || (mode === 'single' ? (selected as Date) : (selected as DateRange)?.from) || new Date()
    const arr = [baseDate]
    for (let i = 1; i < numberOfMonths; i++) {
      const next = new Date(arr[i - 1])
      next.setMonth(next.getMonth() + 1)
      arr.push(next)
    }
    return arr
  })

  React.useEffect(() => {
    if (controlledMonth) {
      setDisplayMonths((prev) => {
        const arr = [controlledMonth]
        for (let i = 1; i < numberOfMonths; i++) {
          const next = new Date(arr[i - 1])
          next.setMonth(next.getMonth() + 1)
          arr.push(next)
        }
        return arr
      })
    }
  }, [controlledMonth, numberOfMonths])

  const handlePrev = (index: number) => {
    setDisplayMonths((prev) => {
      const newMonths = [...prev]
      const d = new Date(newMonths[index])
      d.setMonth(d.getMonth() - 1)
      newMonths[index] = d

      // Enforce constraint: left <= right
      if (index === 1 && newMonths[1] < newMonths[0]) {
        newMonths[0] = new Date(newMonths[1])
      }

      if (index === 0 && onMonthChange) {
        onMonthChange(newMonths[0])
      }
      return newMonths
    })
  }

  const handleNext = (index: number) => {
    setDisplayMonths((prev) => {
      const newMonths = [...prev]
      const d = new Date(newMonths[index])
      d.setMonth(d.getMonth() + 1)
      newMonths[index] = d

      // Enforce constraint: left <= right
      if (index === 0 && numberOfMonths > 1 && newMonths[0] > newMonths[1]) {
        newMonths[1] = new Date(newMonths[0])
      }

      if (index === 0 && onMonthChange) {
        onMonthChange(newMonths[0])
      }
      return newMonths
    })
  }

  const finalMonthNames = React.useMemo(() => {
    if (monthNames) return monthNames
    try {
      return Array.from({ length: 12 }, (_, i) => {
        const str = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, i, 1))
        return str.charAt(0).toUpperCase() + str.slice(1)
      })
    } catch {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  }, [locale, monthNames])

  const finalDayNames = React.useMemo(() => {
    if (dayNames) return dayNames
    try {
      return Array.from({ length: 7 }, (_, i) => {
        let str = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + i)) // Jan 7, 2024 is Sunday
        str = str.charAt(0).toUpperCase() + str.slice(1)
        if (locale.startsWith('vi')) {
          str = str.replace(/Thứ\s*/i, 'T').replace(/Th\s*/i, 'T')
        }
        return str
      })
    } catch {
      return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }
  }, [locale, dayNames])

  const handleSelect = (date: Date) => {
    if (mode === 'single') {
      onSelect?.(date)
    } else {
      const range = (selected as DateRange) || {}
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined })
      } else {
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: date })
        }
      }
    }
  }

  const renderMonth = (monthIndex: number) => {
    const displayDate = displayMonths[monthIndex]
    const year = displayDate.getFullYear()
    const month = displayDate.getMonth()

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const blanks = Array.from({ length: firstDay }, (_, i) => i)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
      <div key={monthIndex} className="w-max min-w-[280px]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between px-1">
          <button
            onClick={() => handlePrev(monthIndex)}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent p-0 opacity-50 transition-colors hover:bg-muted hover:opacity-100"
            type="button"
            aria-label="Previous month"
          >
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="text-sm font-medium">
            {finalMonthNames[month]} {year}
          </div>

          <button
            onClick={() => handleNext(monthIndex)}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent p-0 opacity-50 transition-colors hover:bg-muted hover:opacity-100"
            type="button"
            aria-label="Next month"
          >
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="w-full">
          <div className="mb-2 grid grid-cols-7">
            {finalDayNames.map((d, idx) => (
              <div key={idx} className="w-9 text-center text-[0.8rem] font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {blanks.map((b) => (
              <div key={`blank-${b}`} className="h-9 w-9" />
            ))}
            {days.map((d) => {
              const date = new Date(year, month, d)
              date.setHours(0, 0, 0, 0)

              let isSelected = false
              let isRangeStart = false
              let isRangeEnd = false
              let isInRange = false

              if (mode === 'single') {
                const sel = selected as Date
                if (sel) {
                  const selNorm = new Date(sel)
                  selNorm.setHours(0, 0, 0, 0)
                  isSelected = selNorm.getTime() === date.getTime()
                }
              } else {
                const range = selected as DateRange
                if (range?.from) {
                  const from = new Date(range.from)
                  from.setHours(0, 0, 0, 0)
                  isRangeStart = from.getTime() === date.getTime()
                }
                if (range?.to) {
                  const to = new Date(range.to)
                  to.setHours(0, 0, 0, 0)
                  isRangeEnd = to.getTime() === date.getTime()
                }
                if (range?.from && range?.to) {
                  const from = new Date(range.from)
                  const to = new Date(range.to)
                  from.setHours(0, 0, 0, 0)
                  to.setHours(0, 0, 0, 0)
                  isInRange = date > from && date < to
                }
                isSelected = isRangeStart || isRangeEnd
              }

              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const isToday = today.getTime() === date.getTime()

              let cellBg = ''
              let btnClass = ''
              let btnSizeClass = 'w-9 h-9' // Standard button size

              if (mode === 'range') {
                if (isInRange) {
                  cellBg = 'bg-brand-500/20'
                  btnClass = 'text-brand-500 hover:bg-brand-500/30'
                  btnSizeClass = 'w-full h-9 rounded-none'
                } else if (isRangeStart && isRangeEnd) {
                  // Only one day selected, standard button
                } else if (isRangeStart) {
                  cellBg = 'relative before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1/2 before:bg-brand-500/20'
                } else if (isRangeEnd) {
                  cellBg = 'relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1/2 before:bg-brand-500/20'
                }
              }

              return (
                <div key={d} className={`relative flex h-9 items-center justify-center ${cellBg}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(date)}
                    className={`${btnSizeClass} relative z-10 flex items-center justify-center rounded-md text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand-500 hover:bg-brand-600 focus:bg-brand-600 text-white'
                        : isToday
                        ? 'bg-muted text-foreground hover:bg-muted-foreground/30'
                        : btnClass || 'bg-transparent text-foreground hover:bg-muted'
                    }`}
                  >
                    {d}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const months = Array.from({ length: numberOfMonths }, (_, i) => i)

  return (
    <div className={`w-max rounded-md p-3 text-foreground ${className}`}>
      <div className="flex flex-col gap-6 sm:flex-row">{months.map((m) => renderMonth(m))}</div>
    </div>
  )
}
