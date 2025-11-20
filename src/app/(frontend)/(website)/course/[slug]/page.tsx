import React, { cache } from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import ErrorCard from '../../_components/ErrorCard'
import View1 from './style-1/view1'
// import View2 from './style-2/view2'
// import View3 from './style-3/view3'

export const revalidate = 60 * 60 * 24; // (24 hours)

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const courses = await payload.find({
    collection: 'web-courses',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = courses.docs.map(({ slug }) => {
    return { slug }
  })
  return params
}

type Props = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Course({ params }: Props) {
  const { slug = '' } = await params

  try {
    const course = await queryCourseBySlug({ slug })
    if (!course) {
      return <PayloadRedirects url={'/course/' + slug} />
    }

    // if (course.renderStyle === 'style-1') return <View1 course={course} />
    // else if (course.renderStyle === 'style-2') return <View2 course={course} />
    // else if (course.renderStyle === 'style-3') return <View3 course={course} />

    return <View1 course={course} />
  } catch (error) {
    return <ErrorCard error={error} />
  }
}

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const course = await queryCourseBySlug({ slug })
  return generateMeta({ doc: course })
}

const queryCourseBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'web-courses',
    limit: 1,
    pagination: false,
    sort: 'orderInCourses',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
