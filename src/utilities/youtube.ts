export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
    /youtu\.be\/([^"&?\/\s]{11})/i,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/i,
    /youtube\.com\/v\/([^"&?\/\s]{11})/i,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

export const buildSecureYouTubeEmbedUrl = (videoId: string): string => {
  const params = new URLSearchParams({
    enablejsapi: '1',
    controls: '0',
    rel: '0',
    modestbranding: '1',
    showinfo: '0',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    cc_load_policy: '0',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

export const buildBunnyEmbedUrl = (videoId: string): string => {
  return `https://iframe.mediadelivery.net/embed/348450/${videoId}`
}
