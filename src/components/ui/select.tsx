'use client'

import * as React from 'react'

interface SelectContextType {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  value: string | string[]
  onChange: (itemValue: string) => void
  multiple: boolean
  registerItem: (value: string, label: string) => void
  unregisterItem: (value: string) => void
  itemsMap: Record<string, string>
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

export function useSelect() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('useSelect must be used within a Select')
  }
  return context
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'> {
  value?: string | string[]
  onChange?: (value: any) => void
  defaultValue?: string | string[]
  multiple?: boolean
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className = '', children, value: externalValue, onChange: externalOnChange, defaultValue, multiple = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const initialValue = defaultValue !== undefined ? defaultValue : multiple ? [] : ''
    const [internalValue, setInternalValue] = React.useState<string | string[]>(initialValue)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const isControlled = externalValue !== undefined
    const value = isControlled ? externalValue : internalValue

    const [itemsMap, setItemsMap] = React.useState<Record<string, string>>({})

    const registerItem = React.useCallback((val: string, label: string) => {
      setItemsMap((prev) => {
        if (prev[val] === label) return prev
        return { ...prev, [val]: label }
      })
    }, [])

    const unregisterItem = React.useCallback((val: string) => {
      setItemsMap((prev) => {
        const next = { ...prev }
        delete next[val]
        return next
      })
    }, [])

    const onChange = (itemValue: string) => {
      if (multiple) {
        const currentArr = Array.isArray(value) ? value : []
        let newArr
        if (currentArr.includes(itemValue)) {
          newArr = currentArr.filter((v) => v !== itemValue)
        } else {
          newArr = [...currentArr, itemValue]
        }
        if (!isControlled) setInternalValue(newArr)
        if (externalOnChange) externalOnChange(newArr)
      } else {
        if (!isControlled) setInternalValue(itemValue)
        if (externalOnChange) externalOnChange(itemValue)
      }
    }

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
      <SelectContext.Provider value={{ isOpen, setIsOpen, value, onChange, multiple, registerItem, unregisterItem, itemsMap }}>
        <div
          ref={(node) => {
            ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          className={`relative w-full ${className}`}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    )
  },
)
Select.displayName = 'Select'

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isError?: boolean
  shape?: 'default' | 'capsule'
  leftIcon?: React.ReactNode
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = '', children, isError, shape = 'default', leftIcon, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect()
    const isCapsule = shape === 'capsule'

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between border border-border bg-card py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50 ${isCapsule ? 'rounded-full px-5' : 'rounded-lg px-3'}
          hover:bg-muted
          ${isError ? '!border-error-500 focus-visible:ring-error-500 text-error-900' : 'focus-visible:ring-brand-500 text-foreground'}
          ${className}`}
        {...props}
      >
        <div className="flex flex-1 items-center gap-2 truncate text-left">
          {leftIcon && <span className="flex-shrink-0 text-muted-foreground">{leftIcon}</span>}
          {children}
        </div>
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
          className={`ml-2 h-4 w-4 flex-shrink-0 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    )
  },
)
SelectTrigger.displayName = 'SelectTrigger'

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = '', placeholder, children, ...props }, ref) => {
    const { value, multiple, itemsMap } = useSelect()

    let displayValue: React.ReactNode

    if (children) {
      displayValue = children
    } else {
      if (multiple && Array.isArray(value)) {
        const labels = value.map((v) => itemsMap[v] || v)
        displayValue = labels.length > 0 ? labels.join(', ') : <span className="text-muted-foreground">{placeholder}</span>
      } else if (value && typeof value === 'string') {
        displayValue = itemsMap[value] || value
      } else {
        displayValue = <span className="text-muted-foreground">{placeholder}</span>
      }
    }

    return (
      <span ref={ref} className={`block truncate ${className}`} {...props}>
        {displayValue}
      </span>
    )
  },
)
SelectValue.displayName = 'SelectValue'

export type SelectContentProps = React.HTMLAttributes<HTMLDivElement>

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(({ className = '', children, ...props }, ref) => {
  const { isOpen } = useSelect()

  return (
    <div
      ref={ref}
      className={`animate-in fade-in zoom-in-95 absolute z-50 mt-2 flex max-h-60 w-full flex-col gap-1 overflow-auto rounded-lg border border-border bg-card p-1 text-foreground shadow-md ${
        !isOpen ? 'hidden' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
SelectContent.displayName = 'SelectContent'

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: React.ReactNode
}

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className = '', children, value: itemValue, icon, ...props }, ref) => {
    const { value, onChange, setIsOpen, multiple, registerItem, unregisterItem } = useSelect()

    const isSelected = multiple ? Array.isArray(value) && value.includes(itemValue) : value === itemValue

    React.useEffect(() => {
      if (typeof children === 'string') {
        registerItem(itemValue, children)
      } else if (Array.isArray(children)) {
        // Fallback for mixed content, extract strings
        const textContent = children.filter((c) => typeof c === 'string').join('')
        if (textContent) registerItem(itemValue, textContent)
      }
      return () => unregisterItem(itemValue)
    }, [itemValue, children, registerItem, unregisterItem])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onChange(itemValue)
      if (!multiple) {
        setIsOpen(false)
      }
      if (props.onClick) props.onClick(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={handleClick}
        className={`group relative flex w-full cursor-pointer select-none items-center gap-2.5 rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground disabled:pointer-events-none disabled:opacity-50
          ${isSelected && !multiple ? 'bg-muted font-medium text-foreground' : ''}
          ${className}`}
        {...props}
      >
        {/* Visual indicator (radio or checkbox) */}
        {multiple ? (
          <div
            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
              isSelected ? 'bg-brand-500 border-brand-500' : 'border-border bg-transparent group-hover:border-muted-foreground/50'
            }`}
          >
            {isSelected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-primary-foreground"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ) : (
          <div
            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
              isSelected ? 'border-brand-500 bg-transparent' : 'border-border bg-transparent group-hover:border-muted-foreground/50'
            }`}
          >
            {isSelected && <div className="bg-brand-500 h-2 w-2 rounded-full" />}
          </div>
        )}

        {/* Item Icon */}
        {icon && <span className="flex-shrink-0 text-muted-foreground">{icon}</span>}

        <span className="flex-1 truncate text-left leading-none">{children}</span>
      </button>
    )
  },
)
SelectItem.displayName = 'SelectItem'

export type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`py-1 ${className}`} {...props} />
))
SelectGroup.displayName = 'SelectGroup'

export type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`px-2 py-1.5 text-sm font-semibold text-muted-foreground ${className}`} {...props} />
))
SelectLabel.displayName = 'SelectLabel'
