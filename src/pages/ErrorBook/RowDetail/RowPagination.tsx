import { currentRowDetailAtom } from '../store'
import type { groupedWordRecords } from '../type'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import NextIcon from '~icons/ooui/next-ltr'
import PrevIcon from '~icons/ooui/next-rtl'

type IRowPaginationProps = {
  className?: string
  allRecords: groupedWordRecords[]
}

const RowPagination: FC<IRowPaginationProps> = ({ className, allRecords }) => {
  const [currentRowDetail, setCurrentRowDetail] = useAtom(currentRowDetailAtom)
  const currentIndex = useMemo(() => {
    if (!currentRowDetail) return -1
    return allRecords.findIndex((record) => record.word === currentRowDetail.word && record.dict === currentRowDetail.dict)
  }, [currentRowDetail, allRecords])

  const nextRowDetail = useCallback(() => {
    if (!currentRowDetail) return
    const index = currentIndex
    if (index === -1) return
    const nextIndex = index + 1
    if (nextIndex >= allRecords.length) return
    setCurrentRowDetail(allRecords[nextIndex])
  }, [currentRowDetail, currentIndex, allRecords, setCurrentRowDetail])

  const prevRowDetail = useCallback(() => {
    if (!currentRowDetail) return
    const index = currentIndex
    if (index === -1) return
    const prevIndex = index - 1
    if (prevIndex < 0) return
    setCurrentRowDetail(allRecords[prevIndex])
  }, [currentRowDetail, currentIndex, setCurrentRowDetail, allRecords])

  useHotkeys(
    'left',
    (e) => {
      prevRowDetail()
      e.stopPropagation()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'right',
    (e) => {
      nextRowDetail()
      e.stopPropagation()
    },
    { preventDefault: true },
  )

  return (
    <div className={`flex select-none items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full"
        onClick={prevRowDetail}
        disabled={currentIndex <= 0}
        aria-label="Từ trước"
      >
        <PrevIcon className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">{`${currentIndex + 1} / ${allRecords.length}`}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full"
        onClick={nextRowDetail}
        disabled={currentIndex >= allRecords.length - 1}
        aria-label="Từ tiếp"
      >
        <NextIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default RowPagination
