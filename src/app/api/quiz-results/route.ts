import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Quiz, QuizQuestion } from '@/payload-types'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await nextHeaders() })

    if (!user || user.collection !== 'users') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { quizId, score, totalQuestions } = body as {
      quizId: number
      score: number
      totalQuestions: number
    }

    if (!quizId || score == null || !totalQuestions) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Fetch quiz and validate
    const quiz = (await payload.findByID({
      collection: 'quizzes',
      id: quizId,
      depth: 1,
      overrideAccess: true,
    })) as Quiz

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (!quiz.saveMarks) {
      return NextResponse.json({ error: 'This quiz does not save marks' }, { status: 400 })
    }

    // Validate totalQuestions matches actual question count
    const questionCount = (quiz.questions ?? []).filter(
      (q): q is QuizQuestion => typeof q === 'object' && q !== null,
    ).length
    if (totalQuestions !== questionCount) {
      return NextResponse.json({ error: 'Question count mismatch' }, { status: 400 })
    }

    // Check for existing result
    const existing = await payload.find({
      collection: 'quiz-results',
      where: {
        user: { equals: user.id },
        quiz: { equals: quizId },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs.length > 0 && !quiz.allowRetake) {
      return NextResponse.json({ error: 'Retake not allowed' }, { status: 403 })
    }

    let result
    if (existing.docs.length > 0) {
      result = await payload.update({
        collection: 'quiz-results',
        id: existing.docs[0]!.id,
        data: {
          score,
          totalQuestions,
          completedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    } else {
      result = await payload.create({
        collection: 'quiz-results',
        data: {
          user: user.id,
          quiz: quizId,
          score,
          totalQuestions,
          completedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ success: true, result })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await nextHeaders() })

    if (!user || user.collection !== 'users') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quizId = request.nextUrl.searchParams.get('quizId')
    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
    }

    const results = await payload.find({
      collection: 'quiz-results',
      where: {
        user: { equals: user.id },
        quiz: { equals: Number(quizId) },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    return NextResponse.json({ result: results.docs[0] ?? null })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
