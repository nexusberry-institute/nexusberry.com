'use client'

import { useLmsVideo } from '@/hooks/useSecureVideo'
import SecureVideoPlayer from '@/components/SecureVideoPlayer'

interface Props {
  slug: string
  title: string
}

export default function LmsVideoPlayer({ slug, title }: Props) {
  const { data, isLoading, error } = useLmsVideo(slug)

  if (isLoading) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Failed to load video</p>
      </div>
    )
  }

  if (data.type === 'youtube') {
    return <SecureVideoPlayer type="youtube" videoId={data.id} title={title} />
  }

  // External video fallback
  return (
    <div className="aspect-video flex items-center justify-center bg-gray-900">
      <div className="text-center p-8">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-white mb-4">External Video Link</p>
        <a
          href={data.id}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
        >
          Watch Video
        </a>
      </div>
    </div>
  )
}
