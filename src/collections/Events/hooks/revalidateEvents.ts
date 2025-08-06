import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

export const revalidateEvents: CollectionAfterChangeHook<Event> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/events/${doc.slug}`

    payload.logger.info(`Revalidating events at path: ${path}`)

    revalidatePath("/events")
    revalidatePath(path)
    revalidatePath(path + "/registeration-success")
    revalidatePath(path + "/review")
    revalidatePath(path + "/live-stream")
    revalidatePath(path + "/certificate")
    revalidateTag('events-sitemap')
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Event> = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const path = `/events/${doc?.slug}`

    payload.logger.info(`Revalidating events at path: ${path}/event`)

    revalidatePath('/events')
    revalidatePath(path)
    revalidatePath(path + "/registeration-success")
    revalidatePath(path + "/review")
    revalidatePath(path + "/live-stream")
    revalidatePath(path + "/certificate")
    revalidateTag('events-sitemap')
  }

  return doc
}
