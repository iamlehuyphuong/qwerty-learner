import { Button } from '@/components/ui/button'
import type { FC } from 'react'
import { useCallback } from 'react'
import NextIcon from '~icons/ooui/next-ltr'
import PrevIcon from '~icons/ooui/next-rtl'

type IPaginationProps = {
  className?: string
  page: number
  setPage: (page: number) => void
  totalPages: number
}

export const ITEM_PER_PAGE = 20

const Pagination: FC<IPaginationProps> = ({ className, page, setPage, totalPages }) => {
  const nextPage = useCallback(() => {
    setPage(page + 1)
  }, [page, setPage])

  const prevPage = useCallback(() => {
    setPage(page - 1)
  }, [page, setPage])

  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={prevPage}
        disabled={isFirstPage}
        aria-label="Trang trước"
      >
        <PrevIcon className="h-4 w-4" />
      </Button>
      <span className="text-sm text-foreground">{`${page} / ${totalPages}`}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={nextPage}
        disabled={isLastPage}
        aria-label="Trang tiếp"
      >
        <NextIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Pagination
