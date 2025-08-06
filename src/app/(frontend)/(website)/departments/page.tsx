// amir
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

// import { generateMeta } from '@/utilities/generateMeta'

// import { PayloadRedirects } from '@/components/PayloadRedirects'
import DepartmentsBar from './_components/DepartmentsBar'
import CoursesCard from "./_components/CoursesCard"
import { unstable_cache } from 'next/cache'
import ErrorCard from '../_components/ErrorCard'

export const dynamic = 'force-static'

const queryDepartments = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'departments',
      pagination: false,
      sort: "orderInDepartments",
      limit: 250,
      depth: 5,
      select: {
        title: true,
        slug: true,
        relatedCourses: true
      },
      joins: {
        relatedCourses: {
          sort: "orderInCourses",
        },
      },
      populate: {
        "web-courses": {
          title: true,
          slug: true,
          image: true,
          duration: true,
          price: true,
          subTitle: true,
          difficultyLevel: true,
        }
      }
    })

    return result.docs || null
  },
  ['courses'],
  {
    tags: ['courses', 'departments'],
  }
)

export default async function Page() {
  try {
    const departments = await queryDepartments()

    if (!departments || !departments.length) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M8 7h6"></path>
                <path d="M8 11h8"></path>
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              No Department Available
            </h1>
            <p className="text-muted-foreground">
              We&#39;re currently working on adding new departments to our catalog. Please check back soon!
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      )

    }
    return (
      <div>
        <DepartmentsBar departments={departments.map(({ relatedCourses, ...rest }) => rest)} />
        <CoursesCard departments={departments} />
      </div>
    )
  } catch (error) {
    return <ErrorCard error={error} />
  }
}

export async function generateMetadata() {
  // const post = await queryCategories()

  // return generateMeta({ doc: post })
  return {
    title: "All Courses | NexusBerry"
  }
}
