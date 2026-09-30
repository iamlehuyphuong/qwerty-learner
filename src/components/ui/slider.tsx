'use client'

import * as React from 'react'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  leftLabel?: React.ReactNode
  rightLabel?: React.ReactNode
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  leftLabel,
  rightLabel,
  className = '',
  disabled = false,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const percentage = Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100))

  return (
    <div className={`flex w-full items-center gap-4 ${disabled ? 'opacity-50' : ''} ${className}`}>
      {leftLabel && <span className="min-w-8 whitespace-nowrap text-right text-xs font-medium text-muted-foreground">{leftLabel}</span>}

      <div className="relative flex h-5 w-full items-center">
        {/* Track Background */}
        <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-border" />

        {/* Track Filled */}
        <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />

        {/* Actual Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="peer absolute left-0 top-1/2 h-5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none"
          {...props}
        />

        {/* Visual Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm ring-1 ring-border transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {rightLabel && <span className="min-w-8 whitespace-nowrap text-xs font-medium text-muted-foreground">{rightLabel}</span>}
    </div>
  )
}
