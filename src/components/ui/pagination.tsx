'use client'

import * as React from 'react'

export const Pagination = ({ className = '', ...props }: React.ComponentProps<'nav'>) => (
  <nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`} {...props} />
)

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(({ className = '', ...props }, ref) => (
  <ul ref={ref} className={`flex flex-row items-center gap-2 ${className}`} {...props} />
))
PaginationContent.displayName = 'PaginationContent'

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className = '', ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

export interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean
}

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(({ className = '', isActive, ...props }, ref) => (
  <a
    ref={ref}
    aria-current={isActive ? 'page' : undefined}
    className={`focus-visible:ring-brand-500 inline-flex h-9 w-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive ? 'bg-foreground text-background hover:bg-foreground/90' : 'text-foreground hover:bg-muted'} 
        ${className}`}
    {...props}
  />
))
PaginationLink.displayName = 'PaginationLink'

export const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof PaginationLink>>(
  ({ className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      className={`border border-border bg-transparent hover:bg-muted ${className}`}
      {...props}
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
        <path d="m15 18-6-6 6-6" />
      </svg>
    </PaginationLink>
  ),
)
PaginationPrevious.displayName = 'PaginationPrevious'

export const PaginationNext = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof PaginationLink>>(
  ({ className = '', ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      className={`border border-border bg-transparent hover:bg-muted ${className}`}
      {...props}
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
        <path d="m9 18 6-6-6-6" />
      </svg>
    </PaginationLink>
  ),
)
PaginationNext.displayName = 'PaginationNext'

export const PaginationEllipsis = ({ className = '', ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={`flex h-9 w-9 items-center justify-center ${className}`} {...props}>
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
)
