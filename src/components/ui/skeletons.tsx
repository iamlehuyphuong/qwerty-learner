import { Skeleton } from './skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type React from 'react'

export function TableSkeleton({ rows = 3, columns = 5, headers }: { rows?: number; columns?: number; headers?: React.ReactNode[] }) {
  const skelBg = ''
  const displayColumns = headers ? headers.length : columns

  return (
    <div className="mt-4 w-full space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background/50">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              {headers
                ? headers.map((header, i) => (
                    <TableHead
                      key={i}
                      className={`h-12 text-xs font-medium uppercase text-neutral-500 ${i === headers.length - 1 ? 'text-right' : ''}`}
                    >
                      {header}
                    </TableHead>
                  ))
                : Array.from({ length: displayColumns }).map((_, i) => (
                    <TableHead key={i} className={i === displayColumns - 1 ? 'text-right' : ''}>
                      <Skeleton className={`h-4 ${i === displayColumns - 1 ? 'ml-auto w-16' : 'w-24'} ${skelBg}`} />
                    </TableHead>
                  ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-border hover:bg-transparent">
                {Array.from({ length: displayColumns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className={colIndex === displayColumns - 1 ? 'text-right' : ''}>
                    <Skeleton
                      className={`h-8 rounded-md ${colIndex === displayColumns - 1 ? 'ml-auto w-10' : 'w-full max-w-[200px]'} ${skelBg}`}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function ListSkeleton({ items = 4 }: { items?: number }) {
  const skelBg = ''
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 rounded-xl border border-border bg-background/50 p-4">
          <Skeleton className={`h-10 w-10 shrink-0 rounded-full ${skelBg}`} />
          <div className="flex-1 space-y-2">
            <Skeleton className={`h-5 w-1/3 max-w-[200px] ${skelBg}`} />
            <Skeleton className={`h-4 w-1/4 max-w-[150px] ${skelBg}`} />
          </div>
          <Skeleton className={`h-9 w-24 rounded-md ${skelBg}`} />
        </div>
      ))}
    </div>
  )
}

export function DocumentListSkeleton({ items = 3 }: { items?: number }) {
  const skelBg = ''
  return (
    <div className="flex w-full flex-col">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={`flex items-center justify-between p-4 ${i !== items - 1 ? 'border-b border-border' : ''}`}>
          <div className="flex flex-1 items-start gap-4">
            <Skeleton className={`h-10 w-10 shrink-0 rounded-lg ${skelBg}`} />
            <div className="mt-0.5 flex flex-1 flex-col space-y-2 pr-6">
              <Skeleton className={`h-5 w-1/2 max-w-[250px] ${skelBg}`} />
              <Skeleton className={`h-3 w-1/3 max-w-[150px] ${skelBg}`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className={`h-8 w-8 rounded-lg ${skelBg}`} />
            <Skeleton className={`h-8 w-8 rounded-lg ${skelBg}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  const skelBg = ''
  return (
    <div className="mt-4 w-full max-w-2xl space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className={`h-4 w-1/4 max-w-[150px] ${skelBg}`} />
          <Skeleton className={`h-10 w-full rounded-md ${skelBg}`} />
        </div>
      ))}
      <Skeleton className={`h-10 w-32 rounded-md ${skelBg}`} />
    </div>
  )
}

export function SettingsSkeleton() {
  const skelBg = ''
  return (
    <div className="mt-4 w-full space-y-12">
      <div className="space-y-6">
        <Skeleton className={`h-5 w-1/4 max-w-[120px] ${skelBg}`} />

        <div className="space-y-8">
          <div className="space-y-3">
            <Skeleton className={`h-4 w-1/5 max-w-[100px] ${skelBg}`} />
            <Skeleton className={`h-10 w-64 rounded-md ${skelBg}`} />
          </div>

          <div className="space-y-3">
            <Skeleton className={`h-4 w-1/5 max-w-[100px] ${skelBg}`} />
            <div className="flex gap-4">
              <Skeleton className={`h-[90px] w-[120px] rounded-xl ${skelBg}`} />
              <Skeleton className={`h-[90px] w-[120px] rounded-xl ${skelBg}`} />
              <Skeleton className={`h-[90px] w-[120px] rounded-xl ${skelBg}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-border pt-10">
        <Skeleton className={`h-5 w-1/4 max-w-[120px] ${skelBg}`} />

        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start justify-between gap-8">
              <div className="flex w-full max-w-[85%] flex-col gap-2">
                <Skeleton className={`h-4 w-1/3 ${skelBg}`} />
                <Skeleton className={`h-3 w-2/3 ${skelBg}`} />
              </div>
              <Skeleton className={`h-6 w-10 shrink-0 rounded-full ${skelBg}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton({ cards = 4 }: { cards?: number }) {
  const skelBg = ''
  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
          <Skeleton className={`h-32 w-full rounded-lg ${skelBg}`} />
          <div className="space-y-2">
            <Skeleton className={`h-5 w-3/4 ${skelBg}`} />
            <Skeleton className={`h-4 w-full ${skelBg}`} />
            <Skeleton className={`h-4 w-5/6 ${skelBg}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AccountSkeleton() {
  const skelBg = ''
  return (
    <div className="mt-4 w-full space-y-8">
      {/* Profile Card */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className={`h-12 w-12 shrink-0 rounded-full ${skelBg}`} />
          <div className="flex flex-col gap-2">
            <Skeleton className={`h-3 w-16 ${skelBg}`} />
            <Skeleton className={`h-8 w-48 rounded-md ${skelBg}`} />
          </div>
        </div>
        <Skeleton className={`h-9 w-9 rounded-lg ${skelBg}`} />
      </div>

      {/* Miễn phí block */}
      <div className="mb-8 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between bg-background/50 p-4">
          <Skeleton className={`h-5 w-24 ${skelBg}`} />
          <Skeleton className={`h-8 w-24 rounded-full ${skelBg}`} />
        </div>
        <div className="border-t border-dashed border-border"></div>
        <div className="space-y-6 bg-background/30 p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className={`h-4 w-20 ${skelBg}`} />
              <Skeleton className={`h-3 w-32 ${skelBg}`} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className={`h-4 w-12 ${skelBg}`} />
              <Skeleton className={`h-3 w-10 ${skelBg}`} />
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className={`h-4 w-24 ${skelBg}`} />
              <Skeleton className={`h-3 w-40 ${skelBg}`} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className={`h-4 w-10 ${skelBg}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Info lists */}
      <div className="space-y-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex items-center justify-between py-5 ${i !== 3 ? 'border-b border-border' : ''}`}>
            <div className="flex flex-col gap-2">
              <Skeleton className={`h-4 w-24 ${skelBg}`} />
              <Skeleton className={`h-3 w-48 ${skelBg}`} />
            </div>
            <Skeleton className={`h-8 w-20 rounded-lg ${skelBg}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
