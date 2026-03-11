'use client'

import { useRef, useId, useEffect } from 'react'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import YouTubeControls from './YouTubeControls'

interface Props {
  videoId: string
  title?: string
  onPlayStateChange?: (isPlaying: boolean) => void
}

export default function YouTubeSecurePlayer({ videoId, title, onPlayStateChange }: Props) {
  const uniqueId = useId()
  const containerId = `yt-player-${uniqueId.replace(/:/g, '')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, controls] = useYouTubePlayer(containerId, videoId)

  useEffect(() => {
    onPlayStateChange?.(state.isPlaying)
  }, [state.isPlaying, onPlayStateChange])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
      tabIndex={0}
    >
      {/* YouTube player renders into this div — pointer-events disabled */}
      <div
        id={containerId}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Transparent overlay blocks right-click and direct iframe interaction */}
      <div
        className="absolute inset-0 z-10"
        onClick={() => controls.togglePlay()}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Large centered play button when paused and ready */}
      {state.isReady && !state.isPlaying && (
        <button
          className="absolute inset-0 z-15 flex items-center justify-center"
          onClick={() => controls.play()}
          aria-label="Play video"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-1"
            >
              <polygon points="6 3 20 12 6 21" />
            </svg>
          </div>
        </button>
      )}

      {/* Error state */}
      {state.error && (
        <div className="absolute inset-0 z-15 flex items-center justify-center bg-black/80">
          <div className="text-center text-white px-4">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm">{state.error}</p>
          </div>
        </div>
      )}

      {/* Custom controls */}
      {state.isReady && (
        <YouTubeControls
          state={state}
          controls={controls}
          containerRef={containerRef}
        />
      )}
    </div>
  )
}
