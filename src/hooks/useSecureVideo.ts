'use client'

import { useState, useEffect } from 'react'
import { decodeVideoPayload } from '@/utilities/videoObfuscation'

type VideoEmbed = { type: 'youtube' | 'bunny'; id: string }

export function useTutorialVideos(slug: string) {
  const [data, setData] = useState<VideoEmbed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/secure-video/tutorial/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load videos')
        return res.json()
      })
      .then((json) => {
        const decoded = decodeVideoPayload(json.d) as { videos: VideoEmbed[] }
        if (!cancelled) {
          setData(decoded.videos ?? [])
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { data, isLoading, error }
}
