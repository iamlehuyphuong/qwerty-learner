'use client'

import * as React from 'react'

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className = '', disabled, ...props }, ref) => {
  return (
    <div className={`relative flex items-center justify-center ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <input
        type="radio"
        className={`checked:bg-brand-500 checked:border-brand-500 focus-visible:ring-brand-500 peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-border bg-card transition-colors focus:outline-none focus-visible:ring-2 ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100"></div>
    </div>
  )
})
Radio.displayName = 'Radio'
