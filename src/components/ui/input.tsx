import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isError?: boolean
  variant?: 'outline' | 'flushed'
  shape?: 'default' | 'capsule'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'outline', shape = 'default', leftIcon, rightIcon, isError, ...props }, ref) => {
    const isFlushed = variant === 'flushed'
    const isCapsule = shape === 'capsule' && !isFlushed

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div
            className={`pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground ${
              isFlushed ? 'left-0' : isCapsule ? 'left-4' : 'left-3'
            }`}
          >
            {leftIcon}
          </div>
        )}
        <input
          className={`flex h-10 w-full bg-transparent py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground
            ${
              isFlushed
                ? 'focus-visible:border-brand-500 rounded-none border-0 border-b border-border px-0 focus-visible:ring-0'
                : `border border-border ${
                    isCapsule ? 'rounded-full' : 'rounded-lg'
                  } bg-card focus-visible:ring-2 focus-visible:ring-offset-1`
            } 
            ${leftIcon ? (isFlushed ? 'pl-7' : isCapsule ? 'pl-11' : 'pl-10') : isCapsule ? 'pl-5' : 'pl-3'} 
            ${rightIcon ? (isFlushed ? 'pr-7' : isCapsule ? 'pr-11' : 'pr-10') : isCapsule ? 'pr-5' : 'pr-3'}
            ${
              isError
                ? isFlushed
                  ? '!border-error-500 text-error-900'
                  : '!border-error-500 focus-visible:ring-error-500 text-error-900'
                : isFlushed
                ? 'focus-visible:border-brand-500 text-foreground'
                : 'focus-visible:ring-brand-500 text-foreground'
            } 
            ${className}`}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div
            className={`pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground ${
              isFlushed ? 'right-0' : isCapsule ? 'right-4' : 'right-3'
            }`}
          >
            {rightIcon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
