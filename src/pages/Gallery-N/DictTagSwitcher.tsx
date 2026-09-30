import { Badge } from '@/components/ui/badge'
import { RadioGroup } from '@headlessui/react'
import { useCallback } from 'react'

type Props = {
  tagList: string[]
  currentTag: string
  onChangeCurrentTag: (tag: string) => void
}

export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  const onChangeTag = useCallback(
    (tag: string) => {
      onChangeCurrentTag(tag)
    },
    [onChangeCurrentTag],
  )

  return (
    <RadioGroup value={currentTag} onChange={onChangeTag}>
      <div className="flex flex-wrap items-center gap-3">
        {tagList.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {({ checked }) => (
              <Badge
                color={checked ? 'brand' : 'neutral'}
                variant={checked ? 'solid' : 'soft'}
                size="md"
                className="whitespace-nowrap transition-all duration-200"
              >
                {option}
              </Badge>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
