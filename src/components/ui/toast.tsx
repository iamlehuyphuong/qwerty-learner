'use client'

import * as React from 'react'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'neutral' | 'brand' | 'error' | 'success' | 'warning'
  variant?: 'solid' | 'soft' | 'outline'
  title: string
  icon?: React.ReactNode
  onClose?: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className = '', color = 'brand', variant = 'soft', title, icon, onClose, children, ...props }, ref) => {
    const colorStyles = {
      neutral: {
        soft: 'bg-foreground border-neutral-800 text-foreground',
        solid: 'bg-foreground border-foreground text-background',
        outline: 'bg-transparent border-border text-foreground',
      },
      brand: {
        soft: 'bg-brand-950/50 border-brand-800 text-brand-300',
        solid: 'bg-brand-500 border-brand-500 text-white',
        outline: 'bg-transparent border-brand-800 text-brand-400',
      },
      error: {
        soft: 'bg-error-950/50 border-error-800 text-error-300',
        solid: 'bg-error-500 border-error-500 text-white',
        outline: 'bg-transparent border-error-800 text-error-400',
      },
      success: {
        soft: 'bg-success-950/50 border-success-800 text-success-300',
        solid: 'bg-success-500 border-success-500 text-white',
        outline: 'bg-transparent border-success-800 text-success-400',
      },
      warning: {
        soft: 'bg-warning-950/50 border-warning-800 text-warning-300',
        solid: 'bg-warning-500 border-warning-500 text-white',
        outline: 'bg-transparent border-warning-800 text-warning-400',
      },
    }

    const DefaultIcon = <div className="h-5 w-5 rounded bg-current opacity-20" />

    return (
      <div
        ref={ref}
        role="alert"
        className={`relative flex w-full items-start gap-3 rounded-lg border p-4 transition-colors ${colorStyles[color][variant]} ${className}`}
        {...props}
      >
        <div className="flex-shrink-0">{icon !== undefined ? icon : DefaultIcon}</div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h5 className="text-sm font-semibold leading-none tracking-tight">{title}</h5>
          {children && <div className="text-sm leading-relaxed opacity-80">{children}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-4 mt-[2px] flex-shrink-0 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Close toast"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  },
)
Toast.displayName = 'Toast'
