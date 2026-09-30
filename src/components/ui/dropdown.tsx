'use client'

import * as React from 'react'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined)

export function useDropdown() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown')
  }
  return context
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(({ className = '', children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick, true)
      document.addEventListener('touchstart', handleOutsideClick, true)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true)
      document.removeEventListener('touchstart', handleOutsideClick, true)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        ref={(node) => {
          // merge refs
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={`relative inline-block text-left ${className}`}
        {...props}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  )
})
Dropdown.displayName = 'Dropdown'

export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className = '', children, asChild, onClick, ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdown()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(!isOpen)
      if (onClick) onClick(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        ref,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          handleClick(e)
          if ((children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.onClick) {
            ;(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props.onClick(e)
          }
        },
        ...props,
      })
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} className={className} {...props}>
        {children}
      </button>
    )
  },
)
DropdownTrigger.displayName = 'DropdownTrigger'

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'center'
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className = '', align = 'left', children, ...props }, ref) => {
    const { isOpen } = useDropdown()

    if (!isOpen) return null

    const alignmentClasses = {
      left: 'left-0',
      right: 'right-0',
      center: 'left-1/2 -translate-x-1/2',
    }

    return (
      <div
        ref={ref}
        className={`animate-in fade-in zoom-in-95 absolute z-50 mt-2 min-w-[8rem] rounded-lg border border-border bg-card p-1 text-foreground shadow-md ${alignmentClasses[align]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DropdownMenu.displayName = 'DropdownMenu'

export type DropdownItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className = '', children, onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdown()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(false)
      if (onClick) onClick(e)
    }

    return (
      <button
        ref={ref}
        role="menuitem"
        onClick={handleClick}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-neutral-100 hover:text-foreground focus:bg-neutral-100 focus:text-foreground disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
DropdownItem.displayName = 'DropdownItem'
