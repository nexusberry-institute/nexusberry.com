'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/utilities/cn'
import { formatTime } from './formatTime'
import type { YouTubePlayerState, YouTubePlayerControls } from '@/hooks/useYouTubePlayer'

interface Props {
  state: YouTubePlayerState
  controls: YouTubePlayerControls
  containerRef: React.RefObject<HTMLDivElement | null>
}

export default function YouTubeControls({ state, controls, containerRef }: Props) {
  const [visible, setVisible] = useState(true)
  const [speedOpen, setSpeedOpen] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const resetHideTimer = useCallback(() => {
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (state.isPlaying) {
      hideTimer.current = setTimeout(() => setVisible(false), 3000)
    }
  }, [state.isPlaying])

  // Show controls when paused, auto-hide when playing
  useEffect(() => {
    if (!state.isPlaying) {
      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    } else {
      resetHideTimer()
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [state.isPlaying, resetHideTimer])

  // Mouse movement on container shows controls
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onMove = () => resetHideTimer()
    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [containerRef, resetHideTimer])

  // Keyboard shortcuts
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within our container or on body
      if (
        document.activeElement &&
        document.activeElement !== document.body &&
        !container.contains(document.activeElement)
      )
        return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          controls.togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          controls.seekTo(Math.max(0, state.currentTime - 5))
          break
        case 'ArrowRight':
          e.preventDefault()
          controls.seekTo(Math.min(state.duration, state.currentTime + 5))
          break
        case 'ArrowUp':
          e.preventDefault()
          controls.setVolume(Math.min(100, state.volume + 10))
          break
        case 'ArrowDown':
          e.preventDefault()
          controls.setVolume(Math.max(0, state.volume - 10))
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          controls.toggleMute()
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTime, state.duration, state.volume])

  // Close speed menu on outside click
  useEffect(() => {
    if (!speedOpen) return
    const onClick = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setSpeedOpen(false)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [speedOpen])

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    controls.seekTo(fraction * state.duration)
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    controls.setVolume(Math.round(fraction * 100))
  }

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
  const buffered = state.bufferedFraction * 100

  const speeds = [0.5, 1, 1.5, 2]

  return (
    <div
      ref={controlsRef}
      className={cn(
        'absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      onMouseEnter={() => setVisible(true)}
    >
      {/* Gradient background */}
      <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-2 px-3">
        {/* Progress bar */}
        <div
          className="group relative h-1 hover:h-1.5 transition-all cursor-pointer mb-2"
          onClick={handleSeek}
        >
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/40"
            style={{ width: `${buffered}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-red-500"
            style={{ width: `${progress}%` }}
          />
          {/* Seek handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 text-white text-sm">
          {/* Play/Pause */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              controls.togglePlay()
            }}
            className="p-1 hover:scale-110 transition-transform"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21" />
              </svg>
            )}
          </button>

          {/* Time */}
          <span className="text-xs tabular-nums select-none">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>

          <div className="flex-1" />

          {/* Speed selector */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSpeedOpen(!speedOpen)
              }}
              className="px-1.5 py-0.5 text-xs hover:bg-white/20 rounded transition-colors"
              aria-label="Playback speed"
            >
              {state.playbackRate}x
            </button>
            {speedOpen && (
              <div className="absolute bottom-full mb-1 right-0 bg-black/90 rounded-lg py-1 min-w-[60px]">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation()
                      controls.setPlaybackRate(s)
                      setSpeedOpen(false)
                    }}
                    className={cn(
                      'block w-full px-3 py-1 text-xs text-left hover:bg-white/20 transition-colors',
                      state.playbackRate === s && 'text-red-400 font-bold',
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1 group/vol">
            <button
              onClick={(e) => {
                e.stopPropagation()
                controls.toggleMute()
              }}
              className="p-1 hover:scale-110 transition-transform"
              aria-label={state.isMuted ? 'Unmute' : 'Mute'}
            >
              {state.isMuted || state.volume === 0 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  {state.volume > 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                </svg>
              )}
            </button>
            <div
              className="w-16 h-1 cursor-pointer hidden group-hover/vol:block"
              onClick={(e) => {
                e.stopPropagation()
                handleVolumeChange(e)
              }}
            >
              <div className="relative h-full rounded-full bg-white/20">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white"
                  style={{ width: `${state.isMuted ? 0 : state.volume}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fullscreen */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
            className="p-1 hover:scale-110 transition-transform"
            aria-label="Toggle fullscreen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
