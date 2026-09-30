import type * as React from 'react'

export interface StepItem {
  label: string
  description?: string
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  currentStep: number
  variant?: 'dot' | 'number'
}

export function Stepper({ steps, currentStep, variant = 'dot', className = '', ...props }: StepperProps) {
  return (
    <div className={`flex w-full items-start ${className}`} {...props}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={index} className="relative flex flex-1 flex-col items-center">
            {/* Connector line */}
            {index !== steps.length - 1 && (
              <div className="absolute left-1/2 top-4 -z-10 flex w-full -translate-y-1/2">
                <div className={`h-[2px] w-full transition-colors duration-200 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors duration-200 ${
                isCompleted
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isActive
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {variant === 'dot' ? (
                isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : isActive ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                ) : null
              ) : (
                <span className="text-sm font-medium">{String(index + 1).padStart(2, '0')}</span>
              )}
            </div>

            {/* Label */}
            <div className="mt-3 flex flex-col items-center text-center">
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              {step.description && <span className="mt-1 text-xs text-muted-foreground">{step.description}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
