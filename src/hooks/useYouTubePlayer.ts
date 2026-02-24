'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Module-level singleton for script loading
let apiLoadPromise: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise
  if (typeof window !== 'undefined' && window.YT?.Player) {
    return Promise.resolve()
  }
  apiLoadPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return apiLoadPromise
}

export interface YouTubePlayerState {
  isReady: boolean
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  bufferedFraction: number
  playbackRate: number
  error: string | null
}

export interface YouTubePlayerControls {
  play: () => void
  pause: () => void
  togglePlay: () => void
  seekTo: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
}

export function useYouTubePlayer(
  containerId: string,
  videoId: string,
): [YouTubePlayerState, YouTubePlayerControls] {
  const playerRef = useRef<YT.Player | null>(null)
  const rafRef = useRef<number>(0)
  const currentVideoIdRef = useRef(videoId)

  const [state, setState] = useState<YouTubePlayerState>({
    isReady: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    bufferedFraction: 0,
    playbackRate: 1,
    error: null,
  })

  const pollState = useCallback(() => {
    const p = playerRef.current
    if (!p || typeof p.getCurrentTime !== 'function') return
    try {
      const playerState = p.getPlayerState()
      setState((prev) => ({
        ...prev,
        isPlaying: playerState === YT.PlayerState.PLAYING,
        currentTime: p.getCurrentTime(),
        duration: p.getDuration(),
        volume: p.getVolume(),
        isMuted: p.isMuted(),
        bufferedFraction: p.getVideoLoadedFraction(),
        playbackRate: p.getPlaybackRate(),
      }))
    } catch {
      // Player might be destroyed
    }
    rafRef.current = requestAnimationFrame(pollState)
  }, [])

  // Initialize player
  useEffect(() => {
    let destroyed = false

    loadYouTubeAPI().then(() => {
      if (destroyed) return
      const container = document.getElementById(containerId)
      if (!container) return

      playerRef.current = new YT.Player(containerId, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          enablejsapi: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            if (destroyed) return
            setState((prev) => ({ ...prev, isReady: true, error: null }))
            rafRef.current = requestAnimationFrame(pollState)
          },
          onStateChange: (event) => {
            if (destroyed) return
            setState((prev) => ({
              ...prev,
              isPlaying: event.data === YT.PlayerState.PLAYING,
            }))
          },
          onError: (event) => {
            if (destroyed) return
            const messages: Record<number, string> = {
              2: 'Invalid video ID',
              5: 'HTML5 player error',
              100: 'Video not found or removed',
              101: 'Video cannot be embedded',
              150: 'Video cannot be embedded',
            }
            setState((prev) => ({
              ...prev,
              error: messages[event.data] || 'Playback error',
            }))
          },
        },
      })
    })

    return () => {
      destroyed = true
      cancelAnimationFrame(rafRef.current)
      try {
        playerRef.current?.destroy()
      } catch {
        // Already destroyed
      }
      playerRef.current = null
    }
    // Only run on mount/unmount for this containerId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId])

  // Handle video switching without destroying player
  useEffect(() => {
    if (videoId === currentVideoIdRef.current) return
    currentVideoIdRef.current = videoId
    const p = playerRef.current
    if (p && state.isReady) {
      try {
        p.loadVideoById(videoId)
      } catch {
        // Player not ready yet
      }
    }
  }, [videoId, state.isReady])

  const controls: YouTubePlayerControls = {
    play: useCallback(() => {
      try {
        playerRef.current?.playVideo()
      } catch { /* noop */ }
    }, []),
    pause: useCallback(() => {
      try {
        playerRef.current?.pauseVideo()
      } catch { /* noop */ }
    }, []),
    togglePlay: useCallback(() => {
      const p = playerRef.current
      if (!p) return
      try {
        if (p.getPlayerState() === YT.PlayerState.PLAYING) {
          p.pauseVideo()
        } else {
          p.playVideo()
        }
      } catch { /* noop */ }
    }, []),
    seekTo: useCallback((seconds: number) => {
      try {
        playerRef.current?.seekTo(seconds, true)
      } catch { /* noop */ }
    }, []),
    setVolume: useCallback((volume: number) => {
      try {
        const p = playerRef.current
        if (!p) return
        p.setVolume(volume)
        if (volume > 0 && p.isMuted()) p.unMute()
      } catch { /* noop */ }
    }, []),
    toggleMute: useCallback(() => {
      try {
        const p = playerRef.current
        if (!p) return
        if (p.isMuted()) {
          p.unMute()
        } else {
          p.mute()
        }
      } catch { /* noop */ }
    }, []),
    setPlaybackRate: useCallback((rate: number) => {
      try {
        playerRef.current?.setPlaybackRate(rate)
      } catch { /* noop */ }
    }, []),
  }

  return [state, controls]
}
