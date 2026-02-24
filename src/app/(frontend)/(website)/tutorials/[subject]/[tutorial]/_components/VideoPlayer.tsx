'use client'

import { useState } from 'react'
import { extractYouTubeId } from '@/utilities/youtube'
import SecureVideoPlayer from '@/components/SecureVideoPlayer'

type Video = {
  videoSource?: 'youtube' | 'bunny' | null
  youtubeUrl?: string | null
  bunnyVideoId?: string | null
  id?: string | null
}

type Props = {
  videos: Video[]
  title: string
}

function getVideoEmbed(video: Video): { type: 'youtube' | 'bunny'; id: string } | null {
  if (video.videoSource === 'youtube' && video.youtubeUrl) {
    const id = extractYouTubeId(video.youtubeUrl)
    if (id) return { type: 'youtube', id }
  }
  if (video.videoSource === 'bunny' && video.bunnyVideoId) {
    return { type: 'bunny', id: video.bunnyVideoId }
  }
  return null
}

export default function VideoPlayer({ videos, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const playableVideos = videos
    .map((v, i) => ({ video: v, embed: getVideoEmbed(v), originalIndex: i }))
    .filter((v): v is { video: Video; embed: NonNullable<ReturnType<typeof getVideoEmbed>>; originalIndex: number } => v.embed !== null)

  if (playableVideos.length === 0) return null

  const active = playableVideos[activeIndex] ?? playableVideos[0]!

  return (
    <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
      {/* Main Video */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black">
        <SecureVideoPlayer
          type={active.embed.type}
          videoId={active.embed.id}
          title={title}
        />
      </div>

      {/* Video List */}
      {playableVideos.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {playableVideos.map((v, idx) => (
            <button
              key={v.video.id ?? idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-40 rounded-lg border-2 overflow-hidden transition-colors ${idx === activeIndex
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
                }`}
            >
              <div className="aspect-video bg-muted flex items-center justify-center relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {idx === activeIndex && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </div>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground truncate">
                Video #{idx + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
