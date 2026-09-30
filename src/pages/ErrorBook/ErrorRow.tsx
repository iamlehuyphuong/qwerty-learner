import { LoadingWordUI } from './LoadingWordUI'
import useGetWord from './hooks/useGetWord'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { idDictionaryMap } from '@/resources/dictionary'
import { recordErrorBookAction } from '@/utils'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback } from 'react'
import DeleteIcon from '~icons/weui/delete-filled'

type IErrorRowProps = {
  record: groupedWordRecords
  onDelete: () => void
}

const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)
  const dictInfo = idDictionaryMap[record.dict]
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo)

  const onClick = useCallback(() => {
    setCurrentRowDetail(record)
    recordErrorBookAction('detail')
  }, [record, setCurrentRowDetail])

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (window.confirm(`Bạn có chắc muốn xóa "${record.word}" khỏi sổ lỗi?`)) {
        onDelete()
      }
    },
    [onDelete, record.word],
  )

  return (
    <div
      className="flex w-full cursor-pointer items-center rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <span className="w-[15%] truncate py-3 pl-6 text-sm font-medium">{record.word}</span>
      <span className="w-[40%] truncate px-4 py-3 text-sm text-muted-foreground">
        {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
      </span>
      <span className="w-[12%] px-4 py-3 text-sm">{record.wrongCount}</span>
      <span className="w-[18%] truncate px-4 py-3 text-sm text-muted-foreground">{dictInfo?.name ?? record.dict}</span>
      <span className="flex w-[15%] justify-end py-3 pr-6" onClick={handleDelete}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteIcon
                className="h-4 w-4 text-muted-foreground/50 transition-colors hover:text-destructive"
                aria-label={`Xóa từ ${record.word}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  )
}

export default ErrorRow
