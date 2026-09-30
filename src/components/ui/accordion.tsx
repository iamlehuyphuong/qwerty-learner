'use client'

import * as React from 'react'

const AccordionContext = React.createContext<{
  expanded: string | null
  setExpanded: React.Dispatch<React.SetStateAction<string | null>>
} | null>(null)

export function Accordion({
  children,
  className = '',
  type = 'single',
}: {
  children: React.ReactNode
  className?: string
  type?: 'single' | 'multiple'
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionItem must be used within Accordion')

  const isExpanded = context.expanded === value

  return (
    <div className={`rounded-lg border border-border bg-card transition-all ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            isExpanded,
          })
        }
        return child
      })}
    </div>
  )
}

export function AccordionTrigger({
  value,
  isExpanded,
  children,
  className = '',
  icon,
  label,
  rightContent,
  hideChevron = false,
}: {
  value?: string
  isExpanded?: boolean
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  label?: React.ReactNode
  rightContent?: React.ReactNode
  hideChevron?: boolean
}) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be used within Accordion')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        // Prevent trigger if clicking on interactive elements inside rightContent
        if ((e.target as HTMLElement).closest('button, a, input, [role="switch"]')) return

        if (value) {
          context.setExpanded(isExpanded ? null : value)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (value) {
            context.setExpanded(isExpanded ? null : value)
          }
        }
      }}
      className={`flex w-full cursor-pointer items-center justify-between px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="flex shrink-0 items-center justify-center text-muted-foreground">{icon}</span>}
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        {children}
      </div>

      <div className="flex items-center gap-3 text-muted-foreground">
        {rightContent}
        {!hideChevron && (
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
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </div>
    </div>
  )
}

export function AccordionContent({
  value,
  isExpanded,
  children,
  className = '',
}: {
  value?: string
  isExpanded?: boolean
  children: React.ReactNode
  className?: string
}) {
  if (!isExpanded) return null

  return (
    <div className="overflow-hidden">
      <div className={`px-4 pb-4 pt-0 text-sm text-muted-foreground ${className}`}>{children}</div>
    </div>
  )
}
