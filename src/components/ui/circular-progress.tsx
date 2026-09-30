'use client'

import * as React from 'react'

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: 'brand' | 'neutral' | 'success' | 'warning' | 'error'
  showValueLabel?: boolean
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className = '', value = 0, size = 'lg', color = 'brand', showValueLabel = false, ...props }, ref) => {
    // Constrain value between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100)

    const sizeMap = {
      sm: { w: 24, stroke: 3, text: 'text-[10px]' },
      md: { w: 32, stroke: 4, text: 'text-xs' },
      lg: { w: 64, stroke: 6, text: 'text-sm' },
      xl: { w: 80, stroke: 8, text: 'text-base' },
      '2xl': { w: 100, stroke: 8, text: 'text-lg font-medium' },
    }

    const colorClasses = {
      brand: 'text-brand-600',
      neutral: 'text-neutral-600',
      success: 'text-success-600',
      warning: 'text-warning-500',
      error: 'text-error-600',
    }

    const trackColorClasses = {
      brand: 'text-brand-50',
      neutral: 'text-neutral-100',
      success: 'text-success-50',
      warning: 'text-warning-50',
      error: 'text-error-50',
    }

    const { w, stroke, text } = sizeMap[size]

    // SVG properties
    const radius = 50 - stroke / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedValue / 100) * circumference

    return (
      <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`} style={{ width: w, height: w }} {...props}>
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            className={`${trackColorClasses[color]} transition-colors`}
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Indicator */}
          <circle
            className={`${colorClasses[color]} transition-all duration-300 ease-in-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>

        {showValueLabel && (
          <div className={`absolute flex items-center justify-center text-foreground ${text}`}>{Math.round(clampedValue)}%</div>
        )}
      </div>
    )
  },
)
CircularProgress.displayName = 'CircularProgress'
