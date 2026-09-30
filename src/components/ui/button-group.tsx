'use client'

import * as React from 'react'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className = '', orientation = 'horizontal', children, ...props }, ref) => {
    const horizontalClasses =
      'flex-row [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:-ml-px'

    const verticalClasses =
      'flex-col [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child)]:-mt-px'

    const baseClasses = 'inline-flex [&>*]:relative [&>*:hover]:z-10 [&>*:focus-within]:z-10 [&>*.active]:z-10'

    return (
      <div
        ref={ref}
        role="group"
        className={`${baseClasses} ${orientation === 'vertical' ? verticalClasses : horizontalClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ButtonGroup.displayName = 'ButtonGroup'
