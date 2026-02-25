import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { canAccessTutorial } from '@/utilities/tutorialAccess'

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
        accessType: true,
        batches: true,
      },
    })

    const tutorial = result.docs[0]
    if (!tutorial) {
      return NextResponse.json({ hasAccess: false }, { headers })
    }

    // Public tutorials are always accessible
    if (!tutorial.accessType || tutorial.accessType === 'public') {
      return NextResponse.json({ hasAccess: true }, { headers })
    }

    // Protected tutorial — check auth
    const { user } = await payload.auth({ headers: await nextHeaders() })
    const accessResult = await canAccessTutorial(payload, user as any, tutorial as any)

    return NextResponse.json({ hasAccess: accessResult.hasAccess }, { headers })
  } catch {
    return NextResponse.json({ hasAccess: false }, { status: 500, headers })
  }
}
