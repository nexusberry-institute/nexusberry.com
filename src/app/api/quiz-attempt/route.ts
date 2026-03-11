import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()
    const { quizId } = body as { quizId: number }

    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
    }

    const quiz = await payload.findByID({
      collection: 'quizzes',
      id: quizId,
      depth: 0,
      overrideAccess: true,
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'quizzes',
      id: quizId,
      data: { attempts: (quiz.attempts ?? 0) + 1 },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
