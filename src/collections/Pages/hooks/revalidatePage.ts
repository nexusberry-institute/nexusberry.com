import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating page: ${doc.slug}`)
  revalidateTag(`page-${doc.slug}`)

  // If slug changed, also revalidate old slug
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating old page slug: ${previousDoc.slug}`)
    revalidateTag(`page-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted page: ${doc.slug}`)
  revalidateTag(`page-${doc.slug}`)

  return doc
}
