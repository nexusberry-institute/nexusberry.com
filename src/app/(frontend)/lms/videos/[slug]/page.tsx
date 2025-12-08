import React from 'react'
import Link from 'next/link'
import { Video } from '@/payload-types'
import Tabs from '../_components/Tabs'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

async function getVideoBySlug(slug: string): Promise<Video | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos?where[slug][equals]=${slug}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  return data?.docs?.[0] || null
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">video Not Found</h1>
          <p className="text-gray-500 mb-6">The video you are looking for does not exist.</p>
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-medium"
          >
            ← Back to videos
          </Link>
        </div>
      </div>
    )
  }

  const youtubeId = extractYouTubeId(video.videoUrl)

  //   console.log('YouTube ID extracted:', youtubeId, 'from URL:', video.videoUrl)

  // Tabs ke data
  const tabs = [
    {
      id: 'notes',
      label: 'Notes',
      content: video?.notes ? (
        <div className="p-4">
          {/* <h3 className="text-xl font-bold mb-4">Video Notes</h3> */}
          <RichText data={video.notes as SerializedEditorState} />
        </div>
      ) : (
        <div className="p-4 text-gray-500">No notes available for this video.</div>
      ),
    },
    {
      id: 'assignment',
      label: 'Assignment',
      content: video?.assignment ? (
        <div className="p-4">
          {/* <h3 className="text-xl font-bold mb-4">Video Assignment</h3> */}
          <RichText data={video.assignment as SerializedEditorState} />
        </div>
      ) : (
        <div className="p-4 text-gray-500">No assignment available for this video.</div>
      ),
    },
    {
      id: 'quiz',
      label: 'Quiz',
      content: (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Quiz Section</h3>
          <p>Yahan quiz questions aur answers honge.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">Question 1</div>
            <div className="p-4 bg-blue-50 rounded">Question 2</div>
          </div>
        </div>
      ),
    },
    {
      id: 'qa',
      label: 'Q/A',
      content: (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Q/A Section</h3>
          <p>Yahan questions aur unke answers show honge.</p>
          <div className="mt-4 space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
              <strong>Q:</strong> First question?
              <br />
              <strong>A:</strong> Answer here.
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
              <strong>Q:</strong> Second question?
              <br />
              <strong>A:</strong> Answer here.
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="m-8">
      {/* Breadcrumb */}
      <div className="max-w-6xl py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/videos" className="hover:text-blue-600 transition">
            Videos
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-800 font-medium">{video.title}</span>
        </nav>
      </div>

      {/* Video Title */}
      {video?.title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{video.title}</h2>
      )}

      {/* Video Player */}
      <div className="relative overflow-hidden rounded-xl bg-black shadow-2xl">
        {youtubeId ? (
          // YouTube Embed with proper parameters
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?modestbranding=1&rel=0&showinfo=0&autoplay=0}`}
              title={video.title}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>

            {/* Alternative if iframe doesn't work */}
            {/* <div className="absolute bottom-4 right-4 z-10">
                  <a 
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Watch on YouTube
                  </a>
                </div> */}
          </div>
        ) : (
          // Direct video or other URL
          <div className="aspect-video flex items-center justify-center bg-gray-900">
            <div className="text-center p-8">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-white mb-4">External Video Link</p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg"
              >
                Watch Video
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Course Materials</h1>

          <div className="mb-8">
            <Tabs tabs={tabs} defaultTab="notes" />
          </div>

          {/* Additional content */}
          {/* <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p>
              Yahan aap upar tabs mein se kisi bhi tab par click karke uska content dekh sakte hain.
            </p>
          </div> */}
        </div>
      </div>

      {/* Video Details */}
      <div className="mt-6 space-y-4">
        {/* Description */}
        {/* {video.notes && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{video.notes}</p>
          </div>
        )} */}

        {/* Video Info */}
        {/* <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">
                Video Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium">{youtubeId ? 'YouTube Video' : 'External Video'}</p>
                </div>
                {youtubeId && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">YouTube ID</p>
                    <p className="font-mono font-medium">{youtubeId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Original URL</p>
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {video.videoUrl}
                  </a>
                </div>
              </div>
            </div> */}
      </div>
    </div>
  )
}

// Function to extract YouTube ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null

  // Different YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
    /youtu\.be\/([^"&?\/\s]{11})/i,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/i,
    /youtube\.com\/v\/([^"&?\/\s]{11})/i,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}
