import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryWithoutCover'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { findCommonValues } from '@/utils'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function DictionaryGroup({ groupedDictsByTag }: { groupedDictsByTag: Record<string, Dictionary[]> }) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '')
  const currentDictInfo = useAtomValue(currentDictInfoAtom)

  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag)
  }, [])

  useEffect(() => {
    const commonTags = findCommonValues(tagList, currentDictInfo.tags)
    if (commonTags.length > 0) {
      setCurrentTag(commonTags[0])
    }
  }, [currentDictInfo.tags, tagList])

  return (
    <div>
      <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
      <div className="mt-8 grid grid-cols-1 gap-6 px-1 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">Không có từ điển nào trong danh mục hiện tại</div>
        )}
      </div>
    </div>
  )
}
