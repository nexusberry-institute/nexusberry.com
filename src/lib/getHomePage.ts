import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export const getCachedHomePage = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    return payload.findGlobal({
      slug: 'home-page',
      depth: 2,
    })
  },
  ['home-page'],
  { tags: ['global_home-page'] },
)

export const getCachedDepartments = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'departments',
      limit: 250,
      pagination: false,
      sort: 'orderInDepartments',
      depth: 1,
      select: {
        title: true,
        slug: true,
        image: true,
      },
    })
    return result.docs
  },
  ['departments-listing'],
  { tags: ['departments-listing'] },
)

export const getCachedCoursesCollection = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'courses-collection',
      limit: 10,
      depth: 2,
    })
    return result.docs
  },
  ['courses-collection-listing'],
  { tags: ['courses-collection-listing'] },
)
