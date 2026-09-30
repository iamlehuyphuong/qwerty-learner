import { Volume, Volume1, Volume2 } from 'lucide-react'

export const VolumeHighIcon = ({ className }: { className?: string }) => {
  return <Volume2 className={className} />
}

export const VolumeIcon = ({ className }: { className?: string }) => {
  return <Volume className={className} />
}

export const VolumeLowIcon = ({ className }: { className?: string }) => {
  return <Volume1 className={className} />
}

export const VolumeMediumIcon = ({ className }: { className?: string }) => {
  return <Volume2 className={className} />
}
