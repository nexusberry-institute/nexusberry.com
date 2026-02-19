import type { Metadata } from 'next/types'
import { unstable_cache } from 'next/cache'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const revalidate = false

const queryBlogPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.find({
      collection: 'posts',
      draft: false,
      depth: 1,
      limit: 24,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
    })
  },
  ['blog-listing'],
  { tags: ['blog-listing'] },
)

export default async function Page() {
  const posts = await queryBlogPosts()

  return (
    <div className="container py-24 px-5">
      {/* <PageClient /> */}
      <div className="prose  max-w-none">
        <h1>NexusBerry Blog</h1>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={24}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `NexusBerry Blog Posts`,
  }
}
