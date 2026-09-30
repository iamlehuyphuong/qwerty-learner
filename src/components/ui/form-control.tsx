import * as React from 'react'

export interface FormControlProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  control: React.ReactNode
  label: string
  description?: string
  bordered?: boolean
}

export const FormControl = React.forwardRef<HTMLLabelElement, FormControlProps>(
  ({ control, label, description, bordered = false, className = '', ...props }, ref) => {
    const borderStyles = bordered ? 'p-4 border border-border rounded-lg bg-card hover:bg-muted transition-colors' : ''

    const alignItems = description ? 'items-start' : 'items-center'

    return (
      <label ref={ref} className={`flex ${alignItems} group cursor-pointer select-none gap-3 ${borderStyles} ${className}`} {...props}>
        <div className={description ? 'mt-0.5' : ''}>{control}</div>
        <div className={`flex flex-col ${description ? 'pt-0.5' : ''}`}>
          <span className="text-sm font-medium leading-none text-foreground">{label}</span>
          {description && <span className="mt-1.5 text-sm leading-snug text-muted-foreground">{description}</span>}
        </div>
      </label>
    )
  },
)
FormControl.displayName = 'FormControl'
