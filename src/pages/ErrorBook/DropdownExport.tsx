import type { groupedWordRecords } from './type'
import { Button } from '@/components/ui/button'
import { idDictionaryMap } from '@/resources/dictionary'
import { wordListFetcher } from '@/utils/wordListFetcher'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { saveAs } from 'file-saver'
import type { FC } from 'react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

type DropdownProps = {
  renderRecords: groupedWordRecords[]
}

const DropdownExport: FC<DropdownProps> = ({ renderRecords }) => {
  const [isExporting, setIsExporting] = useState(false)

  const sanitizeCsvValue = (value: string) => {
    if (/^[=+\-@\t\r]/.test(value)) return `'${value}`
    return value
  }

  const formatTimestamp = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
  }

  const handleExport = async (bookType: string) => {
    setIsExporting(true)

    try {
      const dictUrls: string[] = []
      renderRecords.forEach((item) => {
        const dictInfo = idDictionaryMap[item.dict]
        if (dictInfo?.url && !dictUrls.includes(dictInfo.url)) {
          dictUrls.push(dictInfo.url)
        }
      })

      const dictDataPromises = dictUrls.map(async (url) => {
        try {
          const data = await wordListFetcher(url)
          return { url, data }
        } catch (error) {
          console.error(`Failed to fetch dictionary data from ${url}:`, error)
          return { url, data: [] as Awaited<ReturnType<typeof wordListFetcher>> }
        }
      })

      const dictDataResults = await Promise.all(dictDataPromises)
      const dictDataMap = new Map(dictDataResults.map((result) => [result.url, result.data]))

      const ExportData: Array<{ từ: string; nghĩa: string; 'số lỗi': number; 'từ điển': string }> = []

      renderRecords.forEach((item) => {
        const dictInfo = idDictionaryMap[item.dict]
        let translation = ''

        if (dictInfo?.url && dictDataMap.has(dictInfo.url)) {
          const wordList = dictDataMap.get(dictInfo.url) || []
          const word = wordList.find((w) => w.name === item.word)
          translation = word ? word.trans.join('；') : ''
        }

        const isCsv = bookType === 'csv'
        ExportData.push({
          từ: isCsv ? sanitizeCsvValue(item.word) : item.word,
          nghĩa: isCsv ? sanitizeCsvValue(translation) : translation,
          'số lỗi': item.wrongCount,
          'từ điển': isCsv ? sanitizeCsvValue(dictInfo?.name || item.dict) : dictInfo?.name || item.dict,
        })
      })

      let blob: Blob

      if (bookType === 'txt') {
        const content = ExportData.map((item) => `${item['từ']}: ${item['nghĩa']}`).join('\n')
        blob = new Blob([content], { type: 'text/plain' })
      } else {
        const worksheet = XLSX.utils.json_to_sheet(ExportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
        const excelBuffer = XLSX.write(workbook, { bookType: bookType as XLSX.BookType, type: 'array' })
        blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      }

      const timestamp = formatTimestamp(new Date())
      const fileName = `ErrorBook_${timestamp}.${bookType}`

      if (blob && fileName) {
        saveAs(blob, fileName)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Xuất file không thành công. Vui lòng thử lại.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="z-10 inline-flex justify-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" disabled={isExporting}>
            {isExporting ? 'Đang xuất...' : 'Xuất file'}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="mt-1 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          <DropdownMenu.Item
            className="cursor-pointer rounded-sm px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={() => handleExport('xlsx')}
            disabled={isExporting}
          >
            .xlsx
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer rounded-sm px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            .csv
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default DropdownExport
