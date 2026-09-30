import type React from 'react'

interface DataTagProps {
  icon: React.ElementType
  name: string
  data: number | string
}

const DataTag: React.FC<DataTagProps> = ({ icon, name, data }) => {
  const IconComponent = icon

  return (
    <div className="flex h-10 min-w-[13rem] flex-1 select-none items-center justify-between rounded-lg border border-border bg-secondary px-4 py-5">
      <div className="flex items-center gap-1.5">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
        <span className="break-keep text-sm text-muted-foreground">{name}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{data}</span>
    </div>
  )
}

export default DataTag
