import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateCoursesCollection: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating courses-collection listing`)
  revalidateTag('courses-collection-listing')

  return doc
}

export const revalidateCoursesCollectionDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted courses-collection item`)
  revalidateTag('courses-collection-listing')

  return doc
}
