import type * as React from 'react'

export function Breadcrumb({ className = '', ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="breadcrumb" className={className} {...props} />
}

export function BreadcrumbList({ className = '', ...props }: React.ComponentPropsWithoutRef<'ol'>) {
  return <ol className={`flex flex-wrap items-center gap-2 break-words text-sm text-muted-foreground sm:gap-3 ${className}`} {...props} />
}

export function BreadcrumbItem({ className = '', ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return <li className={`inline-flex items-center gap-2 ${className}`} {...props} />
}

export function BreadcrumbLink({ className = '', href, ...props }: React.ComponentPropsWithoutRef<'a'>) {
  return <a href={href} className={`inline-flex items-center gap-2 transition-colors hover:text-foreground ${className}`} {...props} />
}

export function BreadcrumbPage({ className = '', ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={`inline-flex items-center gap-2 font-medium text-foreground ${className}`}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={`flex items-center text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5 ${className}`}
      {...props}
    >
      {children ?? '/'}
    </li>
  )
}
