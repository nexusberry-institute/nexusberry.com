'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTutorialVideos } from '@/hooks/useSecureVideo'
import SecureVideoPlayer from '@/components/SecureVideoPlayer'

type Props = {
  slug: string
  title: string
  tutorialId?: string
}

function useVideoTracking(tutorialId: string | undefined, activeIndexRef: React.RefObject<number>) {
  const accumulatedRef = useRef(0)
  const isPlayingRef = useRef(false)

  const flush = useCallback(async () => {
    if (!tutorialId || accumulatedRef.current <= 0) return
    const seconds = accumulatedRef.current
    accumulatedRef.current = 0
    fetch('/api/video-watch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorialId,
        videoIndex: activeIndexRef.current,
        watchedSeconds: seconds,
      }),
    }).catch(() => {})
  }, [tutorialId, activeIndexRef])

  // Tick every second when playing
  useEffect(() => {
    if (!tutorialId) return
    const interval = setInterval(() => {
      if (isPlayingRef.current) accumulatedRef.current++
    }, 1000)
    return () => clearInterval(interval)
  }, [tutorialId])

  // Flush every 60 seconds
  useEffect(() => {
    if (!tutorialId) return
    const interval = setInterval(() => {
      flush()
    }, 60_000)
    return () => clearInterval(interval)
  }, [tutorialId, flush])

  // Flush on unmount
  useEffect(() => {
    return () => {
      flush()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setIsPlaying = useCallback((playing: boolean) => {
    isPlayingRef.current = playing
  }, [])

  return { setIsPlaying }
}

export default function VideoPlayer({ slug, title, tutorialId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const { data: playableVideos, isLoading, error } = useTutorialVideos(slug)
  const { setIsPlaying } = useVideoTracking(tutorialId, activeIndexRef)

  const blockContextMenu = (e: React.MouseEvent) => e.preventDefault()

  const handleVideoChange = useCallback((idx: number) => {
    // Flush before switching video
    activeIndexRef.current = idx
    setActiveIndex(idx)
    setIsPlaying(false)
  }, [setIsPlaying])

  // When active video is Bunny (iframe), track open-time as watch time
  useEffect(() => {
    if (!playableVideos || playableVideos.length === 0) return
    const active = playableVideos[activeIndex]
    if (active?.type === 'bunny') {
      setIsPlaying(true)
      return () => setIsPlaying(false)
    }
  }, [activeIndex, playableVideos, setIsPlaying])

  if (isLoading) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14" onContextMenu={blockContextMenu}>
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black aspect-video flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14" onContextMenu={blockContextMenu}>
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black aspect-video flex items-center justify-center">
          <p className="text-gray-400">Failed to load videos</p>
        </div>
      </section>
    )
  }

  if (playableVideos.length === 0) return null

  const active = playableVideos[activeIndex] ?? playableVideos[0]!

  return (
    <section className="padding-x max-w-5xl mx-auto py-10 md:py-14 select-none" onContextMenu={blockContextMenu}>
      {/* Main Video */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-black">
        <SecureVideoPlayer
          type={active.type}
          videoId={active.id}
          title={title}
          onPlayStateChange={setIsPlaying}
        />
      </div>

      {/* Video List */}
      {playableVideos.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {playableVideos.map((v, idx) => (
            <button
              key={`${v.type}-${v.id}-${idx}`}
              onClick={() => handleVideoChange(idx)}
              className={`shrink-0 w-40 rounded-lg border-2 overflow-hidden transition-colors ${idx === activeIndex
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
