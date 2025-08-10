import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { WebCourse } from '../../../payload-types'

export const revalidateCourses: CollectionAfterChangeHook<WebCourse> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/course/${doc.slug}`

    payload.logger.info(`Revalidating post at path: ${path}`)

    revalidatePath(path)
    // revalidateTag('courses-sitemap')
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<WebCourse> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/course/${doc?.slug}`

    revalidatePath(path)
    // revalidateTag('courses-sitemap')
  }

  return doc
}
