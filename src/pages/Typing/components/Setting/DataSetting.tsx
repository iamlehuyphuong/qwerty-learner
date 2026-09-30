import styles from './index.module.css'
import type { ExportProgress, ImportProgress } from '@/utils/db/data-export'
import { exportDatabase, importDatabase } from '@/utils/db/data-export'
import * as Progress from '@radix-ui/react-progress'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useCallback, useState } from 'react'

export default function DataSetting() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const exportProgressCallback = useCallback(({ totalRows, completedRows, done }: ExportProgress) => {
    if (done) {
      setIsExporting(false)
      setExportProgress(100)
      return true
    }
    if (totalRows) {
      setExportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  const onClickExport = useCallback(() => {
    setExportProgress(0)
    setIsExporting(true)
    exportDatabase(exportProgressCallback)
  }, [exportProgressCallback])

  const importProgressCallback = useCallback(({ totalRows, completedRows, done }: ImportProgress) => {
    if (done) {
      setIsImporting(false)
      setImportProgress(100)
      return true
    }
    if (totalRows) {
      setImportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  const onStartImport = useCallback(() => {
    setImportProgress(0)
    setIsImporting(true)
  }, [])

  const onClickImport = useCallback(() => {
    importDatabase(onStartImport, importProgressCallback)
  }, [importProgressCallback, onStartImport])

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Xuất dữ liệu</span>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Dữ liệu luyện tập chỉ được lưu trên thiết bị hiện tại. Hãy sao lưu thường xuyên để tránh mất dữ liệu.
            </span>
            <span className="pl-4 text-left text-sm font-bold leading-tight text-red-400">
              Vui lòng không chỉnh sửa tệp dữ liệu đã xuất.
            </span>
            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress.Root
                className="translate-z-0 relative h-2 w-11/12 transform overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600"
                value={exportProgress}
              >
                <Progress.Indicator
                  className="h-full w-full bg-indigo-500 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - exportProgress}%)` }}
                />
              </Progress.Root>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${exportProgress}%`}</span>
            </div>

            <button
              className="ml-4 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20 disabled:opacity-50"
              type="button"
              onClick={onClickExport}
              disabled={isExporting}
              title="Xuất dữ liệu"
            >
              Xuất dữ liệu
            </button>
          </div>
          <div className={styles.section}>
            <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Nhập dữ liệu</span>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Lưu ý: việc nhập dữ liệu sẽ <strong className="text-sm font-bold text-red-400">ghi đè hoàn toàn</strong> dữ liệu hiện tại. Hãy
              thao tác cẩn thận.
            </span>

            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress.Root
                className="translate-z-0 relative h-2 w-11/12 transform overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600"
                value={importProgress}
              >
                <Progress.Indicator
                  className="h-full w-full bg-indigo-500 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - importProgress}%)` }}
                />
              </Progress.Root>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600 dark:text-white/80">{`${importProgress}%`}</span>
            </div>

            <button
              className="ml-4 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20 disabled:opacity-50"
              type="button"
              onClick={onClickImport}
              disabled={isImporting}
              title="Nhập dữ liệu"
            >
              Nhập dữ liệu
            </button>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
