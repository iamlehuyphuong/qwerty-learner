'use client'

import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'soft' | 'outline'
  color?: 'neutral' | 'brand' | 'error' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onClose?: () => void
}

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'solid', color = 'neutral', size = 'md', icon, onClose, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors border'

    const sizeStyles = {
      sm: 'text-xs px-3 py-1 gap-1.5',
      md: 'text-sm px-4 py-1.5 gap-2',
      lg: 'text-base px-5 py-2 gap-2.5',
    }

    const colorVariantStyles = {
      neutral: {
        solid: 'bg-foreground text-background border-transparent',
        soft: 'bg-muted text-foreground border-transparent',
        outline: 'bg-transparent text-foreground border-border',
      },
      brand: {
        solid: 'bg-brand-500 text-white border-transparent',
        soft: 'bg-brand-500/20 text-brand-400 border-transparent',
        outline: 'bg-transparent text-brand-400 border-brand-700',
      },
      error: {
        solid: 'bg-error-500 text-white border-transparent',
        soft: 'bg-error-500/20 text-error-400 border-transparent',
        outline: 'bg-transparent text-error-400 border-error-700',
      },
      success: {
        solid: 'bg-success-500 text-white border-transparent',
        soft: 'bg-success-500/20 text-success-400 border-transparent',
        outline: 'bg-transparent text-success-400 border-success-700',
      },
      warning: {
        solid: 'bg-warning-500 text-white border-transparent',
        soft: 'bg-warning-500/20 text-warning-400 border-transparent',
        outline: 'bg-transparent text-warning-400 border-warning-700',
      },
    }

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }

    const closeButtonHoverStyles = {
      neutral: {
        solid: 'hover:bg-neutral-300',
        soft: 'hover:bg-muted-foreground/30',
        outline: 'hover:bg-muted',
      },
      brand: {
        solid: 'hover:bg-brand-600',
        soft: 'hover:bg-brand-500/30',
        outline: 'hover:bg-brand-500/10',
      },
      error: {
        solid: 'hover:bg-error-600',
        soft: 'hover:bg-error-500/30',
        outline: 'hover:bg-error-500/10',
      },
      success: {
        solid: 'hover:bg-success-600',
        soft: 'hover:bg-success-500/30',
        outline: 'hover:bg-success-500/10',
      },
      warning: {
        solid: 'hover:bg-warning-600',
        soft: 'hover:bg-warning-500/30',
        outline: 'hover:bg-warning-500/10',
      },
    }

    return (
      <div ref={ref} className={`${baseStyles} ${sizeStyles[size]} ${colorVariantStyles[color][variant]} ${className}`} {...props}>
        {icon && <span className={`flex shrink-0 items-center justify-center ${iconSizeClasses[size]}`}>{icon}</span>}
        <span>{children}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`focus-visible:ring-brand-500 flex shrink-0 items-center justify-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 ${closeButtonHoverStyles[color][variant]}`}
            aria-label="Remove badge"
          >
            <XIcon className={iconSizeClasses[size]} />
          </button>
        )}
      </div>
    )
  },
)
Badge.displayName = 'Badge'
