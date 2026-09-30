import styles from './index.module.css'
import { Switch } from '@/components/ui/switch'
import { isIgnoreCaseAtom, isShowAnswerOnHoverAtom, isShowPrevAndNextWordAtom, isTextSelectableAtom, randomConfigAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtom } from 'jotai'

export default function AdvancedSetting() {
  const [randomConfig, setRandomConfig] = useAtom(randomConfigAtom)
  const [isShowPrevAndNextWord, setIsShowPrevAndNextWord] = useAtom(isShowPrevAndNextWordAtom)
  const [isIgnoreCase, setIsIgnoreCase] = useAtom(isIgnoreCaseAtom)
  const [isTextSelectable, setIsTextSelectable] = useAtom(isTextSelectableAtom)
  const [isShowAnswerOnHover, setIsShowAnswerOnHover] = useAtom(isShowAnswerOnHoverAtom)

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Xáo trộn thứ tự từ</span>
              <Switch checked={randomConfig.isOpen} onChange={() => setRandomConfig((prev) => ({ ...prev, isOpen: !prev.isOpen }))} />
            </div>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Các từ trong mỗi chương sẽ được sắp xếp ngẫu nhiên. Có hiệu lực từ chương tiếp theo.
            </span>
          </div>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Hiển thị từ trước/sau</span>
              <Switch checked={isShowPrevAndNextWord} onChange={() => setIsShowPrevAndNextWord((prev) => !prev)} />
            </div>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Hiển thị từ trước và từ tiếp theo trong quá trình luyện tập.
            </span>
          </div>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Bỏ qua chữ hoa/thường</span>
              <Switch checked={isIgnoreCase} onChange={() => setIsIgnoreCase((prev) => !prev)} />
            </div>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Không phân biệt chữ hoa chữ thường khi nhập. Ví dụ: &quot;hello&quot; và &quot;Hello&quot; đều được tính là đúng.
            </span>
          </div>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Cho phép chọn văn bản</span>
              <Switch checked={isTextSelectable} onChange={() => setIsTextSelectable((prev) => !prev)} />
            </div>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>Cho phép chọn văn bản bằng chuột.</span>
          </div>
          <div className={styles.section}>
            <div className="flex w-full items-center justify-between">
              <span className={`${styles.sectionLabel} text-gray-600 dark:text-white`}>Gợi ý khi hover</span>
              <Switch checked={isShowAnswerOnHover} onChange={() => setIsShowAnswerOnHover((prev) => !prev)} />
            </div>
            <span className={`${styles.sectionDescription} text-gray-600 dark:text-white/70`}>
              Hiển thị đáp án khi di chuột vào từ trong chế độ viết im lặng.
            </span>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
