import DropdownExport from './DropdownExport'
import ErrorRow from './ErrorRow'
import type { ISortType } from './HeadWrongNumber'
import HeadWrongNumber from './HeadWrongNumber'
import Pagination, { ITEM_PER_PAGE } from './Pagination'
import RowDetail from './RowDetail'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import { LoadingUI } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db, useDeleteWordRecord } from '@/utils/db'
import type { WordRecord } from '@/utils/db/record'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconX from '~icons/tabler/x'

export function ErrorBook() {
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = useMemo(() => Math.ceil(groupedRecords.length / ITEM_PER_PAGE), [groupedRecords.length])
  const [sortType, setSortType] = useState<ISortType>('asc')
  const navigate = useNavigate()
  const currentRowDetail = useAtomValue(currentRowDetailAtom)
  const { deleteWordRecord } = useDeleteWordRecord()
  const [reload, setReload] = useState(false)

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
    },
    [totalPages],
  )

  const setSort = useCallback(
    (sortType: ISortType) => {
      setSortType(sortType)
      setPage(1)
    },
    [setPage],
  )

  const sortedRecords = useMemo(() => {
    if (sortType === 'none') return groupedRecords
    return [...groupedRecords].sort((a, b) => {
      if (sortType === 'asc') {
        return a.wrongCount - b.wrongCount
      } else {
        return b.wrongCount - a.wrongCount
      }
    })
  }, [groupedRecords, sortType])

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE
    const end = start + ITEM_PER_PAGE
    return sortedRecords.slice(start, end)
  }, [currentPage, sortedRecords])

  useEffect(() => {
    setIsLoading(true)
    db.wordRecords
      .where('wrongCount')
      .above(0)
      .toArray()
      .then((records) => {
        const groupMap = new Map<string, groupedWordRecords>()

        records.forEach((record) => {
          const key = `${record.word}\0${record.dict}`
          let group = groupMap.get(key)
          if (!group) {
            group = { word: record.word, dict: record.dict, records: [], wrongCount: 0 }
            groupMap.set(key, group)
          }
          group.records.push(record as WordRecord)
        })

        const groups = Array.from(groupMap.values())
        groups.forEach((group) => {
          group.wrongCount = group.records.reduce((acc, cur) => acc + cur.wrongCount, 0)
        })

        setGroupedRecords(groups)
      })
      .finally(() => setIsLoading(false))
  }, [reload])

  const handleDelete = async (word: string, dict: string) => {
    await deleteWordRecord(word, dict)
    setReload((prev) => !prev)
  }

  return (
    <>
      <div className={`relative flex h-screen w-full flex-col items-center pb-4 ease-in ${currentRowDetail && 'blur-sm'}`}>
        <div className="relative mt-4 flex w-full items-center justify-center px-8">
          <h1 className="text-2xl font-semibold text-foreground">Sổ lỗi</h1>
          <div className="absolute right-8 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Click vào từ để xem chi tiết</span>
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <IconX className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-1 select-text items-start justify-center overflow-hidden">
          <div className="flex h-full w-full max-w-[1200px] flex-col px-4 pt-6">
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[15%] pl-6">Từ</TableHead>
                    <TableHead className="w-[40%]">Nghĩa</TableHead>
                    <TableHead className="w-[12%]">
                      <HeadWrongNumber sortType={sortType} setSortType={setSort} />
                    </TableHead>
                    <TableHead className="w-[18%]">Từ điển</TableHead>
                    <TableHead className="w-[15%] pr-6 text-right">
                      <DropdownExport renderRecords={sortedRecords} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            <ScrollArea.Root className="flex-1 overflow-y-auto pt-3">
              <ScrollArea.Viewport className="h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <LoadingUI />
                  </div>
                ) : groupedRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-20">
                    <span className="text-lg text-muted-foreground">Chưa có từ sai nào</span>
                    <span className="text-sm text-muted-foreground/60">Hãy bắt đầu luyện tập để theo dõi lỗi gõ</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {renderRecords.map((record) => (
                      <ErrorRow
                        key={`${record.dict}-${record.word}`}
                        record={record}
                        onDelete={() => handleDelete(record.word, record.dict)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical"></ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
        {totalPages > 0 && <Pagination className="pt-3" page={currentPage} setPage={setPage} totalPages={totalPages} />}
      </div>
      {currentRowDetail && <RowDetail currentRowDetail={currentRowDetail} allRecords={sortedRecords} />}
    </>
  )
}
