import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Quiz } from '../../../payload-types'

const revalidateRelatedTutorials = async (
  quizId: number,
  payload: Parameters<CollectionAfterChangeHook>[0]['req']['payload'],
) => {
  const tutorials = await payload.find({
    collection: 'tutorials',
    where: { quiz: { equals: quizId } },
    select: { slug: true, subject: true },
    limit: 0,
    depth: 0,
  })

  for (const tutorial of tutorials.docs) {
    payload.logger.info(`Revalidating tutorial (quiz changed): ${tutorial.slug}`)
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

export const revalidateQuiz: CollectionAfterChangeHook<Quiz> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  await revalidateRelatedTutorials(doc.id, payload)

  return doc
}

export const revalidateDeleteQuiz: CollectionAfterDeleteHook<Quiz> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  await revalidateRelatedTutorials(doc.id, payload)

  return doc
}
