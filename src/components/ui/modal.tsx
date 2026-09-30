'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  className?: string
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  align = 'left',
  size = 'md',
  className = '',
}: ModalProps) => {
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

  const isCenter = align === 'center'

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes backdrop-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'backdrop-enter 0.2s ease-out forwards' }}
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative z-[101] flex w-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-2xl ${
          isCenter ? 'text-center' : 'text-left'
        } ${
          {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            '3xl': 'max-w-3xl',
            '4xl': 'max-w-4xl',
            '5xl': 'max-w-5xl',
          }[size] || 'max-w-md'
        } ${className}`}
        style={{ animation: 'modal-enter 0.2s ease-out forwards' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="focus-visible:ring-brand-500 absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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

        {/* Header */}
        {(title || description) && (
          <div className={`flex flex-col gap-2 ${isCenter ? 'mt-2 items-center px-6' : 'pr-8'}`}>
            {title && <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>}
            {description && <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>}
          </div>
        )}

        {/* Body */}
        {children && <div className="flex min-h-0 flex-1 flex-col text-sm text-foreground">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className={`flex ${isCenter ? 'w-full flex-col items-stretch gap-3' : 'flex-row justify-end gap-3'}`}>{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
