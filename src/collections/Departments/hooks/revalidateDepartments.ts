import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateDepartments: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating department: ${doc.slug}`)
  revalidateTag(`department-${doc.slug}`)
  revalidateTag('departments-listing')

  // If slug changed, revalidate old slug
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating old department slug: ${previousDoc.slug}`)
    revalidateTag(`department-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted department: ${doc.slug}`)
  revalidateTag(`department-${doc.slug}`)
  revalidateTag('departments-listing')

  return doc
}
