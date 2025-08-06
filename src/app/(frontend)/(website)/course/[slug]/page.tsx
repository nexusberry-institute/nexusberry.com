import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import Link from 'next/link'

import View1 from './style-1/view1'
import View2 from './style-2/view2'
import View3 from './style-3/view3'
import { generateMeta } from '@/utilities/generateMeta'
import ErrorCard from '../../_components/ErrorCard'

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
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Course Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn&#39;t find the course &#34;{slug}&#34; you&#39;re looking for. It may have been removed or the URL might be incorrect.
            </p>
            <div className="pt-4">
              <Link
                href="/departments"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      )
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
