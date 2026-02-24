import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { extractYouTubeId } from '@/utilities/youtube'

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
      collection: 'videos',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      select: {
        videoUrl: true,
        title: true,
      },
    })

    const video = result.docs[0]
    if (!video) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers })
    }

    const youtubeId = extractYouTubeId(video.videoUrl)
    if (youtubeId) {
      return NextResponse.json({ type: 'youtube', id: youtubeId }, { headers })
    }

    return NextResponse.json({ type: 'external', id: video.videoUrl }, { headers })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500, headers })
  }
}
