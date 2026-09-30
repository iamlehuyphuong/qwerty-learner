import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ReactNode } from 'react'

const Tooltip = ({ children, content, className, placement = 'top' }: TooltipProps) => {
  return (
    <TooltipProvider>
      <ShadcnTooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={`relative ${className || ''}`}>{children}</div>
        </TooltipTrigger>
        <TooltipContent side={placement}>
          <p>{content}</p>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  )
}

export type TooltipProps = {
  children: ReactNode
  /** văn bản hiển thị */
  content: string
  /** Vị trí */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default Tooltip
