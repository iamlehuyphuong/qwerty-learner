import { Badge } from './badge'
import type * as React from 'react'

export interface PageHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  badge?: string
}

export function PageHeading({ title, description, badge, className = '', ...props }: PageHeadingProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {badge && (
          <Badge
            variant="soft"
            color="success"
            className="font-normal"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rounded-full bg-green-200 p-0.5 text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          >
            {badge}
          </Badge>
        )}
      </div>
      {description && <p className="max-w-3xl text-sm text-muted-foreground text-muted-foreground">{description}</p>}
    </div>
  )
}
