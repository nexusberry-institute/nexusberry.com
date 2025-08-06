'use client'

import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  src: string
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const videoElement = document.createElement("video-js")
    videoElement.classList.add('vjs-big-play-centered')
    videoRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      controls: true,
      fluid: true,
      sources: [{ src, type: 'video/mp4' }]
    })

    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [src])

  return <div ref={videoRef} data-vjs-player />
}

