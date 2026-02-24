import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { QuizQuestion } from '../../../payload-types'

const revalidateTutorialsForQuestion = async (
  questionId: number,
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
) => {
  const quizzes = await payload.find({
    collection: 'quizzes',
    where: { questions: { contains: questionId } },
    select: {},
    limit: 0,
    depth: 0,
  })

  if (quizzes.docs.length === 0) return

  const quizIds = quizzes.docs.map((q) => q.id)

  const tutorials = await payload.find({
    collection: 'tutorials',
    where: { quiz: { in: quizIds } },
    select: { slug: true, subject: true },
    limit: 0,
    depth: 0,
  })

  for (const tutorial of tutorials.docs) {
    payload.logger.info(`Revalidating tutorial (quiz question changed): ${tutorial.slug}`)
    revalidateTag(`tutorial-${tutorial.slug}`)

    const subjectId =
      typeof tutorial.subject === 'object' && tutorial.subject !== null
        ? tutorial.subject.id
        : tutorial.subject

    if (subjectId) {
      revalidateTag(`tutorials-subject-${subjectId}`)
    }
  }

  if (tutorials.docs.length > 0) {
    revalidateTag('tutorials-listing')
  }
}

export const revalidateQuizQuestion: CollectionAfterChangeHook<QuizQuestion> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  await revalidateTutorialsForQuestion(doc.id, payload)

  return doc
}

export const revalidateDeleteQuizQuestion: CollectionAfterDeleteHook<QuizQuestion> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  await revalidateTutorialsForQuestion(doc.id, payload)

  return doc
}
