'use client'

import * as React from 'react'

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className = '', disabled, ...props }, ref) => {
  return (
    <div className={`relative flex items-center justify-center ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <input
        type="checkbox"
        className={`checked:bg-brand-500 checked:border-brand-500 focus-visible:ring-brand-500 peer h-5 w-5 cursor-pointer appearance-none rounded border border-border bg-card transition-colors focus:outline-none focus-visible:ring-2 ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <svg
        className="pointer-events-none absolute h-3.5 w-3.5 text-background opacity-0 transition-opacity peer-checked:opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  )
})
Checkbox.displayName = 'Checkbox'
