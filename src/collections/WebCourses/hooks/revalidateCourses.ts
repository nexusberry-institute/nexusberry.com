import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { WebCourse } from '../../../payload-types'

export const revalidateCourses: CollectionAfterChangeHook<WebCourse> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating web-course: ${doc.slug}`)
  revalidateTag(`course-${doc.slug}`)

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating old course slug: ${previousDoc.slug}`)
    revalidateTag(`course-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<WebCourse> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted web-course: ${doc.slug}`)
  revalidateTag(`course-${doc.slug}`)

  return doc
}
