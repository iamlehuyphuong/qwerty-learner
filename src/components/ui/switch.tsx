'use client'

import * as React from 'react'

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className = '', disabled, ...props }, ref) => {
  return (
    <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <input
        type="checkbox"
        role="switch"
        className={`peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-neutral-200 transition-colors peer-checked:bg-indigo-500 dark:bg-neutral-700 dark:peer-checked:bg-indigo-500"></div>
      <div className="pointer-events-none absolute left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
    </div>
  )
})
Switch.displayName = 'Switch'
