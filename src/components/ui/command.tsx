'use client'

import { Popover, PopoverContent, PopoverTrigger } from './popover'
import * as React from 'react'

interface CommandContextType {
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSelect: (value: string) => void
}

const CommandContext = React.createContext<CommandContextType | undefined>(undefined)

export function useCommand() {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error('useCommand must be used within a Command')
  }
  return context
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value: string) => void
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(({ className = '', children, onValueChange, ...props }, ref) => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSelect = React.useCallback(
    (value: string) => {
      onValueChange?.(value)
    },
    [onValueChange],
  )

  return (
    <CommandContext.Provider value={{ searchTerm, setSearchTerm, onSelect: handleSelect }}>
      <div ref={ref} className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-card text-foreground ${className}`} {...props}>
        {children}
      </div>
    </CommandContext.Provider>
  )
})
Command.displayName = 'Command'

export type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className = '', ...props }, ref) => {
  const { searchTerm, setSearchTerm } = useCommand()

  return (
    <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
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
        className="mr-2 shrink-0 opacity-50"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={ref}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = 'CommandInput'

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`max-h-[300px] overflow-y-auto overflow-x-hidden p-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar]:w-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
)
CommandList.displayName = 'CommandList'

export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    const { searchTerm } = useCommand()
    // In a real robust command palette, this would check if any child matched.
    // For simplicity, we assume this is conditionally rendered by the parent based on filtered results.
    return (
      <div ref={ref} className={`py-6 text-center text-sm text-muted-foreground ${className}`} {...props}>
        {children}
      </div>
    )
  },
)
CommandEmpty.displayName = 'CommandEmpty'

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className = '', value, children, onClick, ...props }, ref) => {
    const { onSelect } = useCommand()

    return (
      <div
        ref={ref}
        onClick={(e) => {
          onSelect(value)
          onClick?.(e)
        }}
        className={`relative flex cursor-default cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted hover:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  },
)
CommandItem.displayName = 'CommandItem'
