import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

export default function HandPositionIllustration() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 border-indigo-500 text-indigo-500 transition-colors">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium leading-6 text-gray-800 dark:text-gray-200">
            Biểu tượng ngón tay được đề xuất gõ
          </DialogTitle>
        </DialogHeader>
        <div className="mt-8 flex justify-center">
          <img className="block max-w-full" src={standTypingHandPosition} alt="Standard typing hand position" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
