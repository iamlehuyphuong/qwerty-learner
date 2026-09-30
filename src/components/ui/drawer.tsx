'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Drawer = ({ isOpen, onClose, position = 'right', title, description, children, footer, className = '' }: DrawerProps) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  // Determine classes based on position
  let panelClasses = ''
  let animationName = ''

  switch (position) {
    case 'right':
      panelClasses = 'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l border-border'
      animationName = 'drawer-slide-right'
      break
    case 'left':
      panelClasses = 'inset-y-0 left-0 h-full w-3/4 sm:max-w-lg border-r border-border'
      animationName = 'drawer-slide-left'
      break
    case 'top':
      panelClasses = 'inset-x-0 top-0 w-full h-auto max-h-[80vh] border-b border-border'
      animationName = 'drawer-slide-top'
      break
    case 'bottom':
      panelClasses = 'inset-x-0 bottom-0 w-full h-auto max-h-[80vh] border-t border-border'
      animationName = 'drawer-slide-bottom'
      break
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex">
      <style>{`
        @keyframes drawer-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawer-slide-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes drawer-slide-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes drawer-slide-top {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes drawer-slide-bottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        style={{ animation: 'drawer-backdrop 0.2s ease-out forwards' }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed z-10 flex flex-col bg-card text-foreground shadow-xl ${panelClasses} ${className}`}
        style={{ animation: `${animationName} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && <div className="mt-auto flex items-center gap-3 border-t border-border p-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
