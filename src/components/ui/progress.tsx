import * as React from 'react'

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  value?: number
  max?: number
  color?: 'neutral' | 'brand' | 'error' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  label?: React.ReactNode
  caption?: React.ReactNode
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = '', value = 0, max = 100, color = 'brand', size = 'md', label, caption, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const colorClasses = {
      neutral: 'bg-foreground',
      brand: 'bg-brand-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
    }

    return (
      <div className={`flex w-full flex-col gap-1.5 ${className}`} ref={ref} {...props}>
        {label && <div className="text-sm font-medium text-foreground">{label}</div>}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          className={`relative w-full overflow-hidden rounded-full bg-border ${sizeClasses[size]}`}
        >
          <div
            className={`h-full w-full flex-1 rounded-full transition-all duration-300 ease-in-out ${colorClasses[color]}`}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        {caption && <div className="text-xs text-muted-foreground">{caption}</div>}
      </div>
    )
  },
)
Progress.displayName = 'Progress'
