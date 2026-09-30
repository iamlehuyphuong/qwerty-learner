import * as React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean
  variant?: 'outline' | 'flushed'
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant = 'outline', isError, ...props }, ref) => {
    const isFlushed = variant === 'flushed'

    return (
      <textarea
        className={`flex min-h-[80px] w-full bg-transparent py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground
          ${
            isFlushed
              ? 'focus-visible:border-brand-500 rounded-none border-0 border-b border-border px-0 focus-visible:ring-0'
              : 'rounded-lg border border-border bg-card px-3 focus-visible:ring-2 focus-visible:ring-offset-1'
          }
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
    )
  },
)
Textarea.displayName = 'Textarea'
