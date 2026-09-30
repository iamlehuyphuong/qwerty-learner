import { Button } from '@/components/ui/button'
import { recordAnalysisAction } from '@/utils'
import { PieChart } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AnalysisButton = () => {
  const navigate = useNavigate()

  const toAnalysis = useCallback(() => {
    navigate('/analysis')
    recordAnalysisAction('open')
  }, [navigate])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toAnalysis}
      className="h-8 w-8 border-indigo-500 text-indigo-500 transition-colors"
      title="Xem số liệu thống kê"
    >
      <PieChart className="h-5 w-5" />
    </Button>
  )
}

export default AnalysisButton
