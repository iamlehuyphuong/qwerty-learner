import {
  ChatGPTIcon,
  ClaudeIcon,
  DeepSeekIcon,
  FacebookIcon,
  GeminiIcon,
  GoogleAdIcon,
  GoogleAnalyticsIcon,
  InstagramIcon,
  MetaIcon,
  OllamaIcon,
  PerplexityIcon,
  TelegramIcon,
  TiktokAdIcon,
  TiktokIcon,
  YoutubeIcon,
} from '@/components/ui/icons'
import { ConnectorId } from '@/config/connector-ids'
import { Database, Webhook } from 'lucide-react'
import Image from 'next/image'

/**
 * Shared utility for rendering connector icons
 */
export function getConnectorIcon(connectorId: string, className = 'h-5 w-5') {
  switch (connectorId) {
    case ConnectorId.FACEBOOK:
      return <FacebookIcon className={`${className} text-[#1877F2]`} />
    case ConnectorId.INSTAGRAM:
      return <InstagramIcon className={`${className} text-[#E1306C]`} />
    case ConnectorId.META_ADS:
      return <MetaIcon className={className} />
    case ConnectorId.YOUTUBE:
      return <YoutubeIcon className={`${className} text-[#FF0000]`} />
    case ConnectorId.TIKTOK:
      return <TiktokIcon className={`${className} text-foreground`} />
    case ConnectorId.TIKTOK_ADS:
      return <TiktokAdIcon className={className} />
    case ConnectorId.GOOGLE_ADS:
      return <GoogleAdIcon className={className} />
    case ConnectorId.GA4:
      return <GoogleAnalyticsIcon className={`${className} text-[#f9ab00]`} />
    default:
      return <Database className={`${className} text-muted-foreground`} />
  }
}

/**
 * Shared utility for rendering integration provider icons
 */
export function getIntegrationIcon(iconUrl: string | undefined, className = 'h-5 w-5 rounded-sm') {
  if (!iconUrl) {
    return <Database className={`${className} text-muted-foreground`} />
  }

  // Handle built-in integration icons
  switch (iconUrl) {
    case 'openai':
      return <ChatGPTIcon className={className} />
    case 'anthropic':
      return <ClaudeIcon className={className} />
    case 'gemini':
      return <GeminiIcon className={className} />
    case 'deepseek':
      return <DeepSeekIcon className={className} />
    case 'perplexity':
      return <PerplexityIcon className={className} />
    case 'ollama':
      return <OllamaIcon className={className} />
    case 'telegram':
      return <TelegramIcon className={className} />
    case 'webhooks':
      return <Webhook className={className} />
  }

  let isValidUrl = true
  try {
    if (!iconUrl.startsWith('/') && !iconUrl.startsWith('data:')) {
      new URL(iconUrl)
    }
  } catch (e) {
    isValidUrl = false
  }

  if (!isValidUrl) {
    return <Database className={`${className} text-muted-foreground`} />
  }

  return <Image src={iconUrl} alt="Provider icon" width={24} height={24} className={className} />
}
