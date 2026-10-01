import SharePicDialog from './SharePicDialog'
import { Button } from '@/components/ui/button'
import { recordShareAction } from '@/utils'
import { useCallback, useMemo, useState } from 'react'
import IconShare2 from '~icons/tabler/share-2'

export default function ShareButton() {
  const [isShowSharePanel, setIsShowSharePanel] = useState(false)

  const randomChoose = useMemo(
    () => ({
      picRandom: Math.random(),
      promoteRandom: Math.random(),
    }),
    [],
  )

  const onClickShare = useCallback(() => {
    recordShareAction('open')
    setIsShowSharePanel(true)
  }, [])

  return (
    <>
      {isShowSharePanel && <SharePicDialog showState={isShowSharePanel} setShowState={setIsShowSharePanel} randomChoose={randomChoose} />}

      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onClickShare}
        title="Chia sẻ kết quả của bạn"
        className="h-8 w-8 border border-solid !border-slate-500 !bg-transparent text-indigo-500 transition-colors hover:!bg-indigo-500/10 hover:text-indigo-600"
      >
        <IconShare2 className="h-4 w-4" />
      </Button>
    </>
  )
}
