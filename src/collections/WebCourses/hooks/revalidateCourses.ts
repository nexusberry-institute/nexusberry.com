import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'
import type { WebCourse } from '../../../payload-types'

export const revalidateCourses: CollectionAfterChangeHook<WebCourse> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/course/${doc.slug}`
    payload.logger.info(`Revalidating web-course: ${path}`)
    revalidatePath(path)
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<WebCourse> = ({
  doc,
  req: { payload, context }
}) => {
  if (!context.disableRevalidate) {
    const path = `/course/${doc?.slug}`
    payload.logger.info(`Revalidating web-course: ${path}`)
    revalidatePath(path)
  }
  return doc
}
