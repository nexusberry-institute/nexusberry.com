'use client'

import { buildBunnyEmbedUrl } from '@/utilities/youtube'

interface Props {
  videoId: string
  title?: string
}

export default function BunnySecurePlayer({ videoId, title }: Props) {
  return (
    <div
      className="relative w-full aspect-video bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={buildBunnyEmbedUrl(videoId)}
        title={title ?? 'Video'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
