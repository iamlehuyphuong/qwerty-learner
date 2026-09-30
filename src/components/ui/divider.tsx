import * as React from 'react'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({ className = '', orientation = 'horizontal', ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={`shrink-0 bg-border ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'} ${className}`}
      {...props}
    />
  )
})
Divider.displayName = 'Divider'
