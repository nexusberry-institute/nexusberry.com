'use client'

import YouTubeSecurePlayer from './YouTubeSecurePlayer'
import BunnySecurePlayer from './BunnySecurePlayer'

interface Props {
  type: 'youtube' | 'bunny'
  videoId: string
  title?: string
}

export default function SecureVideoPlayer({ type, videoId, title }: Props) {
  if (type === 'youtube') {
    return <YouTubeSecurePlayer videoId={videoId} title={title} />
  }
  return <BunnySecurePlayer videoId={videoId} title={title} />
}
