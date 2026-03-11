import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await nextHeaders() })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tutorialId, videoIndex, watchedSeconds } = body as {
      tutorialId: string
      videoIndex: number
      watchedSeconds: number
    }

    const tutorialIdNum = parseInt(tutorialId, 10)
    if (!tutorialId || isNaN(tutorialIdNum) || typeof videoIndex !== 'number' || typeof watchedSeconds !== 'number') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Check if tracking is enabled for this tutorial
    const tutorialResult = await payload.find({
      collection: 'tutorials',
      where: { id: { equals: tutorialIdNum } },
      overrideAccess: true,
      limit: 1,
      depth: 0,
      select: { trackVideoWatch: true },
    })

    const tutorial = tutorialResult.docs[0]
    if (!tutorial || tutorial.trackVideoWatch === false) {
      return NextResponse.json({ ok: true })
    }

    // Find existing watch log for this user + tutorial + videoIndex
    const existing = await payload.find({
      collection: 'tutorial-video-watch-logs',
      where: {
        and: [
          { user: { equals: user.id } },
          { tutorial: { equals: tutorialIdNum } },
          { videoIndex: { equals: videoIndex } },
        ],
      },
      overrideAccess: true,
      limit: 1,
      depth: 0,
    })

    const now = new Date().toISOString()

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]!
      await payload.update({
        collection: 'tutorial-video-watch-logs',
        id: doc.id,
        overrideAccess: true,
        data: {
          totalWatchTime: (doc.totalWatchTime ?? 0) + watchedSeconds,
          lastWatchedAt: now,
          sessions: (doc.sessions ?? 1) + 1,
        },
      })
    } else {
      await payload.create({
        collection: 'tutorial-video-watch-logs',
        overrideAccess: true,
        data: {
          user: user.id,
          tutorial: tutorialIdNum,
          videoIndex,
          totalWatchTime: watchedSeconds,
          lastWatchedAt: now,
          sessions: 1,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
