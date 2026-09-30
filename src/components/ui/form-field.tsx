import * as React from 'react'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  required?: boolean
  hint?: string
  state?: 'default' | 'error' | 'success' | 'warning' | 'info'
  children: React.ReactNode
}

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)
const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
)
const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
)

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className = '', label, required, hint, state = 'default', children, ...props }, ref) => {
    const stateColors = {
      default: 'text-muted-foreground',
      error: 'text-error-500',
      success: 'text-success-500',
      warning: 'text-warning-500',
      info: 'text-brand-500',
    }

    return (
      <div ref={ref} className={`w-full space-y-1.5 ${className}`} {...props}>
        {label && (
          <label className="text-sm font-semibold text-foreground">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        {children}
        {hint && (
          <p className={`flex items-center gap-1.5 text-xs ${stateColors[state]} font-medium`}>
            {state === 'error' && <ErrorIcon />}
            {state === 'warning' && <WarningIcon />}
            {state === 'success' && <SuccessIcon />}
            {state === 'info' && <InfoIcon />}
            {state === 'default' && <InfoIcon />}
            {hint}
          </p>
        )}
      </div>
    )
  },
)
FormField.displayName = 'FormField'
