'use client'

import { useState } from 'react'
import { useTutorialVideos } from '@/hooks/useSecureVideo'
import SecureVideoPlayer from '@/components/SecureVideoPlayer'

type Props = {
  slug: string
  title: string
}

export default function VideoPlayer({ slug, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: playableVideos, isLoading, error } = useTutorialVideos(slug)

  if (isLoading) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black aspect-video flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black aspect-video flex items-center justify-center">
          <p className="text-gray-400">Failed to load videos</p>
        </div>
      </section>
    )
  }

  if (playableVideos.length === 0) return null

  const active = playableVideos[activeIndex] ?? playableVideos[0]!

  return (
    <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
      {/* Main Video */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black">
        <SecureVideoPlayer
          type={active.type}
          videoId={active.id}
          title={title}
        />
      </div>

      {/* Video List */}
      {playableVideos.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {playableVideos.map((v, idx) => (
            <button
              key={`${v.type}-${v.id}-${idx}`}
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
