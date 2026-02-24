import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { extractYouTubeId } from '@/utilities/youtube'
import { encodeVideoPayload } from '@/utilities/videoObfuscation'

const headers = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // Block cross-origin requests
  if (origin && !origin.startsWith(serverUrl)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
  }
  if (referer && !referer.startsWith(serverUrl)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
  }

  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'tutorials',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      select: {
        showVideos: true,
        videos: true,
      },
    })

    const tutorial = result.docs[0]
    if (!tutorial || tutorial.showVideos === false) {
      return NextResponse.json({ d: encodeVideoPayload({ videos: [] }) }, { headers })
    }

    const videos = (tutorial.videos ?? [])
      .map((v) => {
        if (v.videoSource === 'youtube' && v.youtubeUrl) {
          const id = extractYouTubeId(v.youtubeUrl)
          if (id) return { type: 'youtube' as const, id }
        }
        if (v.videoSource === 'bunny' && v.bunnyVideoId) {
          return { type: 'bunny' as const, id: v.bunnyVideoId }
        }
        return null
      })
      .filter(Boolean)

    return NextResponse.json({ d: encodeVideoPayload({ videos }) }, { headers })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500, headers })
  }
}
