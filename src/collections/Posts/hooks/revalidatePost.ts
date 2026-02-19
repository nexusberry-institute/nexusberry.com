import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc._status === 'published') {
    payload.logger.info(`Revalidating blog post: ${doc.slug}`)
    revalidateTag(`blog-${doc.slug}`)
    revalidateTag('blog-listing')
  }

  // If unpublished, revalidate old slug + listing
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    payload.logger.info(`Revalidating unpublished blog post: ${previousDoc.slug}`)
    revalidateTag(`blog-${previousDoc.slug}`)
    revalidateTag('blog-listing')
  }

  // If slug changed while published, revalidate old slug
  if (previousDoc?.slug && previousDoc.slug !== doc.slug && doc._status === 'published') {
    payload.logger.info(`Revalidating old blog slug: ${previousDoc.slug}`)
    revalidateTag(`blog-${previousDoc.slug}`)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating deleted blog post: ${doc.slug}`)
  revalidateTag(`blog-${doc.slug}`)
  revalidateTag('blog-listing')

  return doc
}
