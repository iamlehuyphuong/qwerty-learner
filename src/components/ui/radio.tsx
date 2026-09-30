'use client'

import * as React from 'react'

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className = '', disabled, ...props }, ref) => {
  return (
    <div className={`relative flex h-5 w-5 items-center justify-center ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <input
        type="radio"
        className={`peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-gray-500 transition-colors peer-checked:border-indigo-500 peer-checked:bg-indigo-500"></div>
      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100"></div>
    </div>
  )
})
Radio.displayName = 'Radio'
