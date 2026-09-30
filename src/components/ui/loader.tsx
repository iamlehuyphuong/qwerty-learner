'use client'

import * as React from 'react'

export interface LoaderProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'current'
}

export const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(({ className = '', size = 'md', color = 'brand', ...props }, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const colorClasses = {
    brand: 'text-brand-500',
    neutral: 'text-muted-foreground',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    current: 'text-current',
  }

  return (
    <svg
      ref={ref}
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" className="opacity-20" />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeDasharray="62.83"
        strokeDashoffset="42"
        strokeLinecap="round"
        className="opacity-100"
      />
    </svg>
  )
})
Loader.displayName = 'Loader'
