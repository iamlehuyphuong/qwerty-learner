import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback } from 'react'
import DownIcon from '~icons/fa/sort-down'
import UPIcon from '~icons/fa/sort-up'

type IHeadWrongNumberProps = {
  className?: string
  sortType: ISortType
  setSortType: (sortType: ISortType) => void
}

export type ISortType = 'asc' | 'desc' | 'none'

const HeadWrongNumber: FC<IHeadWrongNumberProps> = ({ className, sortType, setSortType }) => {
  const onClick = useCallback(() => {
    const sortTypes: Record<ISortType, ISortType> = {
      asc: 'desc',
      desc: 'none',
      none: 'asc',
    }
    setSortType(sortTypes[sortType])
  }, [setSortType, sortType])

  const ariaSort = sortType === 'asc' ? 'ascending' : sortType === 'desc' ? 'descending' : 'none'

  return (
    <span
      className={`inline-flex cursor-pointer items-center gap-1 ${className}`}
      onClick={onClick}
      role="button"
      aria-sort={ariaSort}
      aria-label="Sắp xếp theo số lỗi"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      Số lỗi
      <span className="inline-flex flex-col text-[10px] leading-none">
        <UPIcon
          className={classNames('-mb-1.5', {
            'text-indigo-500': sortType === 'asc',
            'text-gray-400': sortType !== 'asc',
          })}
        />
        <DownIcon
          className={classNames({
            'text-indigo-500': sortType === 'desc',
            'text-gray-400': sortType !== 'desc',
          })}
        />
      </span>
    </span>
  )
}

export default HeadWrongNumber
