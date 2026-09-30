import { Button } from '@/components/ui/button'
import { recordErrorBookAction } from '@/utils'
import { Book } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorBookButton = () => {
  const navigate = useNavigate()

  const toErrorBook = useCallback(() => {
    navigate('/error-book')
    recordErrorBookAction('open')
  }, [navigate])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toErrorBook}
      className="h-8 w-8 border-indigo-500 text-indigo-500 transition-colors"
      title="Kiểm tra sổ câu hỏi sai"
    >
      <Book className="h-5 w-5" />
    </Button>
  )
}

export default ErrorBookButton
