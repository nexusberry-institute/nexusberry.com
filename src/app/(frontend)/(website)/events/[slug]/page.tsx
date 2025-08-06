import React from 'react'
import Hero from './_components/Hero'
import CourseDetail from './_components/CourseDetail'
import JoinUs from './_components/JoinUs'
import CourseInfo from './_components/CourseInfo'
import UpcomingClasses from './_components/UpcomingClasses'
import RegistrationFooter from './_components/RegistrationFooter'
import Review from './_components/Review'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { Metadata } from 'next'
import Link from 'next/link'
import ErrorCard from '../../_components/ErrorCard'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    limit: 100,
    depth: 2,
    select: {
      slug: true,
    },
    where: {
      startDateTime: {
        greater_than_equal: new Date().toISOString(), // Only future events
      }
    }
  })
  const params = events.docs.map(({ slug }) => {
    return { slug }
  })
  return params
}

export const revalidate = 86400 // Revelidate every 24 hours (1 day). So that ended events are not shown.

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params
  const { event, error } = await queryEventsBySlug({ slug })

  if (error) {
    return <ErrorCard error={error} />
  }

  if (!event) {
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
            Event Not Found
          </h1>
          <p className="text-muted-foreground">
            We couldn&#39;t find the event &#34;{slug}&#34; you&#39;re looking for. It may have been removed or the URL might be incorrect.
          </p>
          <div className="pt-4">
            <Link
              href="/events"
              className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Browse All Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto bg-card">
      <Hero
        title={event.title}
        startDateTime={event.startDateTime}
        endTime={event.endTime}
        instructor={event.instructor}
        eventId={event.id}
        slug={event.slug}
      />
      {
        event.learningOutcomes && <CourseDetail
          learningOutcomes={event.learningOutcomes}
          image={typeof event.image === 'object' ? event.image : undefined} />
      }
      <JoinUs
        instructor={typeof event.instructor === "object" ? event.instructor : undefined}
        title={event.title}
        startDateTime={event.startDateTime}
        eventId={event.id}
        slug={event.slug}
        whatsappLink={event.whatsappLink}
        whatsappQrCode={event.whatsappQrCode}
      />
      <Review title={event.title} slug={slug} />
      <CourseInfo eventId={event.id} slug={event.slug} startDateTime={event.startDateTime} />
      <UpcomingClasses slug={slug} />
      <RegistrationFooter
        startDateTime={event.startDateTime}
        endTime={event.endTime}
        eventId={event.id}
        slug={event.slug}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const { event } = await queryEventsBySlug({ slug })
  if (!event) {
    return {
      title: 'Event Not Found | Nexusberry Institute',
      description: 'The requested event could not be found.'
    }
  }
  return generateMeta({ doc: event })
}

const queryEventsBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    return {
      event: result.docs?.[0],
    }
  } catch (error) {
    return {
      event: null,
      error
    }
  }
})
