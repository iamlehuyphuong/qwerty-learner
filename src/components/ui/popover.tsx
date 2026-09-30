'use client'

import * as React from 'react'

interface PopoverContextType {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined)

export function usePopover() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('usePopover must be used within a Popover')
  }
  return context
}

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({ className = '', children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        ref={(node) => {
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={`relative inline-block ${className}`}
        {...props}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  )
})
Popover.displayName = 'Popover'

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className = '', children, asChild = false, onClick, ...props }, ref) => {
    const { isOpen, setIsOpen } = usePopover()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(!isOpen)
      onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          ref,
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            handleClick(e)
            ;(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.onClick?.(e)
          },
        } as React.HTMLAttributes<HTMLElement>,
      )
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} className={className} {...props}>
        {children}
      </button>
    )
  },
)
PopoverTrigger.displayName = 'PopoverTrigger'

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right'
  sideOffset?: number
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className = '', children, align = 'center', sideOffset = 24, style, ...props }, ref) => {
    const { isOpen } = usePopover()

    if (!isOpen) return null

    let alignmentClasses = ''
    if (align === 'left') alignmentClasses = 'left-0'
    else if (align === 'right') alignmentClasses = 'right-0'
    else if (align === 'center') alignmentClasses = 'left-1/2 -translate-x-1/2'

    const hasBg = className.includes('bg-')
    const bgClass = hasBg ? '' : 'bg-card'

    return (
      <div
        ref={ref}
        className={`absolute z-50 w-72 rounded-md border border-border ${bgClass} animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 p-4 text-foreground shadow-md outline-none ${alignmentClasses} ${className}`}
        style={{ top: `calc(100% + ${sideOffset}px)`, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
PopoverContent.displayName = 'PopoverContent'
