import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const getCoursesSitemap = async (payload: any, SITE_URL: string) => {
  const results = await payload.find({
    collection: 'web-courses',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs
    ? results.docs
      .filter((course: any) => Boolean(course?.slug))
      .map((course: any) => ({
        url: `${SITE_URL}/course/${course?.slug}`,
        lastModified: course.updatedAt || dateFallback,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // (valid range: 0.0-1.0)
      }))
    : []

  return sitemap
}

const getEventsSitemap = async (payload: any, SITE_URL: string) => {
  const results = await payload.find({
    collection: 'events',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs
    ? results.docs
      .filter((event: any) => Boolean(event?.slug))
      .map((event: any) => ({
        url: `${SITE_URL}/events/${event?.slug}`,
        lastModified: event.updatedAt || dateFallback,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // (valid range: 0.0-1.0)
      }))
    : []

  return sitemap
}

const getBlogSitemap = async (payload: any, SITE_URL: string) => {
  const results = await payload.find({
    collection: 'posts',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs
    ? results.docs
      .filter((post: any) => Boolean(post?.slug))
      .map((post: any) => ({
        url: `${SITE_URL}/blog/${post?.slug}`,
        lastModified: post.updatedAt || dateFallback,
        changeFrequency: 'weekly' as const,
        priority: 0.8, // (valid range: 0.0-1.0)
      }))
    : []

  return sitemap
}

const getPagesSitemap = async (payload: any, SITE_URL: string) => {
  const results = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs
    ? results.docs
      .filter((page: any) => Boolean(page?.slug))
      .map((page: any) => ({
        url: `${SITE_URL}/${page?.slug}`,
        lastModified: page.updatedAt || dateFallback,
        changeFrequency: 'weekly' as const,
        priority: 0.8, // (valid range: 0.0-1.0)
      }))
    : []

  return sitemap
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.nexusberry.com'

  const coursesSitemap = await getCoursesSitemap(payload, SITE_URL)
  const eventsSitemap = await getEventsSitemap(payload, SITE_URL)
  const blogSitemap = await getBlogSitemap(payload, SITE_URL)
  const pagesSitemap = await getPagesSitemap(payload, SITE_URL)
  // const jobsSitemap = await getJobsSitemap(payload, SITE_URL)
  // const formsSitemap = await getJobsSitemap(payload, SITE_URL)

  return [
    {
      url: 'https://www.nexusberry.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.nexusberry.com/departments',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/events',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/contact-us',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/search',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // https://www.nexusberry.com/courses
    // https://www.nexusberry.com/jobs
    // https://www.nexusberry.com/forms
    // https://www.nexusberry.com/bootcamps
    // contact-us
    // gallery
    // training-schedule
    // privacy policy
    // terms and conditions
    // rules-regulations
    // payment-methods
    // nexusberry-fee-structure
    // faqs
    // verify
    // enroll-now
    // 
    ...coursesSitemap,
    ...eventsSitemap,
    ...blogSitemap,
    ...pagesSitemap
  ]
}