import React from 'react'
import Link from 'next/link'
import { Video } from '@/payload-types'
import Tabs from '../_components/Tabs'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import LmsVideoPlayer from './_components/LmsVideoPlayer'

async function getVideoBySlug(slug: string): Promise<Video | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos?where[slug][equals]=${slug}&select[title]=true&select[notes]=true&select[assignment]=true&select[qa]=true&select[poster]=true&select[slug]=true`,
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
        <LmsVideoPlayer slug={slug} title={video.title} />
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

