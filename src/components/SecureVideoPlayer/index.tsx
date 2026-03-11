'use client'

import YouTubeSecurePlayer from './YouTubeSecurePlayer'
import BunnySecurePlayer from './BunnySecurePlayer'

interface Props {
  type: 'youtube' | 'bunny'
  videoId: string
  title?: string
  onPlayStateChange?: (isPlaying: boolean) => void
}

export default function SecureVideoPlayer({ type, videoId, title, onPlayStateChange }: Props) {
  if (type === 'youtube') {
    return <YouTubeSecurePlayer videoId={videoId} title={title} onPlayStateChange={onPlayStateChange} />
  }
  return <BunnySecurePlayer videoId={videoId} title={title} />
}
