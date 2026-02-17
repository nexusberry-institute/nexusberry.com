import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Tutorial } from '../../../payload-types'

export const revalidateTutorial: CollectionAfterChangeHook<Tutorial> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const subjectId =
    typeof doc.subject === 'object' && doc.subject !== null
      ? doc.subject.id
      : doc.subject

  payload.logger.info(`Revalidating tutorial: ${doc.slug}`)

  revalidateTag(`tutorial-${doc.slug}`)

  if (subjectId) {
    revalidateTag(`tutorials-subject-${subjectId}`)
  }

  revalidateTag('tutorials-listing')

  // If slug changed, also revalidate old slug
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating old tutorial slug: ${previousDoc.slug}`)
    revalidateTag(`tutorial-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDeleteTutorial: CollectionAfterDeleteHook<Tutorial> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const subjectId =
    typeof doc.subject === 'object' && doc.subject !== null
      ? doc.subject.id
      : doc.subject

  payload.logger.info(`Revalidating deleted tutorial: ${doc.slug}`)

  revalidateTag(`tutorial-${doc.slug}`)

  if (subjectId) {
    revalidateTag(`tutorials-subject-${subjectId}`)
  }

  revalidateTag('tutorials-listing')

  return doc
}
