import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { extractYouTubeId } from '@/utilities/youtube'
import { encodeVideoPayload } from '@/utilities/videoObfuscation'
import { checkTutorialAccess } from '@/utilities/tutorialAccess'

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
      overrideAccess: true,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      select: {
        showVideos: true,
        videos: true,
        isPublic: true,
        requiresLogin: true,
        batches: true,
      },
    })

    const tutorial = result.docs[0]
    if (!tutorial || tutorial.showVideos === false) {
      return NextResponse.json({ d: encodeVideoPayload({ videos: [] }) }, { headers })
    }

    // Access check — authenticate when requiresLogin or when tutorial has batches (enrollment check)
    const tutorialBatchIds = (tutorial.batches as (number | { id: number })[] | null | undefined)
      ?.map((b) => (typeof b === 'object' && b !== null ? b.id : b))
      .filter(Boolean) as number[] | undefined

    let isAuthenticated = false
    let isEnrolled = false
    if (tutorial.requiresLogin || (tutorialBatchIds && tutorialBatchIds.length > 0)) {
      const { user } = await payload.auth({ headers: await nextHeaders() })
      isAuthenticated = !!user

      // Check enrollment if user is authenticated and tutorial has batches
      if (isAuthenticated && user && tutorialBatchIds && tutorialBatchIds.length > 0) {
        const studentResult = await payload.find({
          collection: 'students',
          where: { user: { equals: user.id } },
          limit: 1,
          depth: 0,
        })
        const student = studentResult.docs[0]
        if (student) {
          const enrollmentResult = await payload.find({
            collection: 'enrollments',
            where: {
              student: { equals: student.id },
              status: { in: ['active', 'graduated'] },
            },
            depth: 0,
            limit: 50,
            pagination: false,
          })
          const enrolledBatchIds = enrollmentResult.docs
            .map((e) => (typeof e.batch === 'object' && e.batch !== null ? e.batch.id : e.batch))
            .filter(Boolean) as number[]
          isEnrolled = tutorialBatchIds.some((id) => enrolledBatchIds.includes(id))
        }
      }
    }

    const accessResult = checkTutorialAccess(tutorial, isAuthenticated, isEnrolled)
    if (!accessResult.hasAccess) {
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
