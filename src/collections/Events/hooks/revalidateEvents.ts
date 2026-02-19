import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Event } from '../../../payload-types'

export const revalidateEvents: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating event: ${doc.slug}`)
  revalidateTag(`event-${doc.slug}`)
  revalidateTag('events-listing')
  revalidateTag('events-details')

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating old event slug: ${previousDoc.slug}`)
    revalidateTag(`event-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted event: ${doc.slug}`)
  revalidateTag(`event-${doc.slug}`)
  revalidateTag('events-listing')
  revalidateTag('events-details')

  return doc
}
