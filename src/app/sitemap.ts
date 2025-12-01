import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const getCoursesSitemap = async (payload: any, SITE_URL: string) => {
  const results = await payload.find({
    collection: 'web-courses',
    overrideAccess: true,
    depth: 0,
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs && results.docs?.length
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
    overrideAccess: true,
    depth: 0,
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const sitemap = results.docs && results.docs?.length
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
    overrideAccess: true,
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

  const sitemap = results.docs && results.docs?.length
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
    overrideAccess: true,
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

  const sitemap = results.docs && results.docs?.length
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
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

  const coursesSitemap = await getCoursesSitemap(payload, SITE_URL)
  const eventsSitemap = await getEventsSitemap(payload, SITE_URL)
  const blogSitemap = await getBlogSitemap(payload, SITE_URL)
  const pagesSitemap = await getPagesSitemap(payload, SITE_URL)
  // const jobsSitemap = await getJobsSitemap(payload, SITE_URL)
  // const formsSitemap = await getJobsSitemap(payload, SITE_URL)
  // const bootcampsSitemap = await getBootcampSitemap(payload, SITE_URL)

  return [
    // 1. static routes /////////////////////////////////////////////
    {
      url: 'https://www.nexusberry.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
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
      url: 'https://www.nexusberry.com/nexusberry-fee-structure',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/payment-methods',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.nexusberry.com/forms',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // about-us
    // gallery
    // training-schedule
    // privacy policy
    // terms and conditions
    // rules-regulations
    // payment-methods
    // nexusberry-fee-structure
    // faqs
    // verify
    // https://www.nexusberry.com/courses
    // enroll-now
    // internship

    // 2. Pages Collection Routes (static pages content) /////////////////////////////////////////////
    ...pagesSitemap,


    // 3. Web Courses Collection Pages /////////////////////////////////////////////
    ...coursesSitemap,

    // 4. Events Collection Pages /////////////////////////////////////////////
    ...eventsSitemap,

    // 5. Blog Posts Collection Pages /////////////////////////////////////////////
    ...blogSitemap,

    // 6. Jobs Collection Pages /////////////////////////////////////////////
    {
      url: 'https://www.nexusberry.com/jobs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // jobs collection is not made yet

    // 7. Students Forms Collection Psges /////////////////////////////////////////////
    // https://www.nexusberry.com/forms

    // 8. Bootcamps Collection Psges /////////////////////////////////////////////
    // https://www.nexusberry.com/bootcamps

    // 9. Free Courses (nexusberry youtube channel)
  ]
}

// Pages already indexed by google
// source: https://search.google.com/search-console/index/drilldown?resource_id=https%3A%2F%2Fwww.nexusberry.com%2F&pages=ALL_URLS&hl=en
