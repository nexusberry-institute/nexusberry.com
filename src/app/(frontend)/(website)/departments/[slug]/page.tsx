import CoursesCard from '../_components/CoursesCard'
import type { Metadata } from 'next'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import ErrorCard from '../../_components/ErrorCard'

export const revalidate = 86400 // 24 hours in seconds

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const departments = await payload.find({
//     collection: 'departments',
//     limit: 250,
//     depth: 4,
//     select: {
//       slug: true,
//     },
//   })

//   const params = departments.docs.map(({ slug }) => {
//     return { slug }
//   })

//   return params
// }

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const departments = await queryDepartmentBySlug({ slug })

    if (!departments.length) {
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
              department Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn&#39;t find the department &#34;{slug}&#34; you&#39;re looking for. It may have been removed or the URL might be incorrect.
            </p>
            <div className="pt-4">
              <Link
                href="/departments"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse All departments
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return <CoursesCard departments={departments} />
  } catch (error) {
    return <ErrorCard error={error} />
  }
}

export async function generateMetadata({ params: paramsPromise }: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const departments = await queryDepartmentBySlug({ slug })
  return generateMeta({ doc: departments[0] })
}

const queryDepartmentBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'departments',
    depth: 4,
    limit: 250,
    select: {
      title: true,
      slug: true,
      relatedCourses: true,
    },
    joins: {
      relatedCourses: {
        sort: 'orderInCourses',
      },
    },
    populate: {
      "web-courses": {
        title: true,
        slug: true,
        image: true,
        difficultyLevel: true,
        price: true,
        subTitle: true,
        duration: true,
      },
    },
    where: {
      slug: {
        equals: slug,
      },
    },
  })


  return result.docs || null
})
