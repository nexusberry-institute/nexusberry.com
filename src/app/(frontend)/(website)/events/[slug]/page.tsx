import React, { Suspense } from 'react'
import Hero from './_components/Hero'
import CourseDetail from './_components/CourseDetail'
import CourseInfo from './_components/CourseInfo'
import UpcomingClasses from './_components/UpcomingClasses'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import Link from 'next/link'
import { Media } from '@/payload-types'
import { unstable_cache } from 'next/cache'
import { EventsGridSkeleton } from '../_components/EventListSkeleton'

export const dynamic = 'force-dynamic'

// export const dynamic = 'force-static'
// export const revalidate = 86400 // 24 hours in seconds

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const events = await payload.find({
//     collection: 'events',
//     limit: 100,
//     depth: 2,
//     select: {
//       slug: true,
//     },
//     where: {
//       startDateTime: {
//         greater_than_equal: new Date().toISOString(), // Only future events
//       },
//       showInUI: {
//         equals: true,
//       },
//     },
//   })
//   const params = events.docs.map(({ slug }) => {
//     return { slug }
//   })
//   return params
// }

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { event } = await queryEventsBySlug(slug)
  console.log("event: ", event);
  // if (error) {
  //   return <ErrorCard error={error} />
  // }

  if (!event) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Event Not Found</h1>
          <p className="text-muted-foreground">
            We couldn&#39;t find the event &#34;{slug}&#34; you&#39;re looking for. It may have been
            removed or the URL might be incorrect.
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
        event={event}
      />
      {event.learningOutcomes && (
        <CourseDetail
          learningOutcomes={event.learningOutcomes}
          image={typeof event.image === 'object' ? event.image : undefined}
          instructor={typeof event.instructor === 'object' ? event.instructor : undefined}
        />
      )}
      {/* <JoinUs
        instructor={typeof event.instructor === 'object' ? event.instructor : undefined}
        title={event.title}
        startDateTime={event.startDateTime}
        eventId={event.id}
        slug={event.slug}
        whatsappLink={event.whatsappLink}
        whatsappQrCode={event.whatsappQrCode}
      /> */}
      {/* <Review title={event.title} slug={slug} /> */}
      <CourseInfo
        eventId={event.id}
        slug={event.slug}
        startDateTime={event.startDateTime}
        eventLabel={event.label}
      />
      <Suspense fallback={<EventsGridSkeleton count={3} />}>
        <UpcomingClasses
          slug={slug}
          eventLabel={event.label}
        />
      </Suspense>
      {/* <RegistrationFooter
        startDateTime={event.startDateTime}
        endTime={event.endTime}
        eventId={event.id}
        slug={event.slug}
      /> */}
      {/* Spacer to prevent footer overlap */}
      <div id="show_footer"></div>
    </div>
  )
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const { event } = await queryEventsBySlug(slug)
  const getImageURL = (image?: number | string | Media | null): string => {
    if (image && typeof image === 'object' && 'url' in image && image.url) {
      return image.url
    }
    return 'https://www.nexusberry.com/nexusberry-logo.png'
  }
  if (!event) {
    return {
      title: 'Event Not Found | Nexusberry Institute',
      description: 'The requested event could not be found.',
      keywords: ['events', 'event registration', 'nexusberry events', 'upcoming events'],
      alternates: {
        canonical: 'https://www.nexusberry.com/events', // ✅ canonical URL
      },
      openGraph: {
        title: 'Events',
        description:
          'Events - This is events page that all events show here you can register from here',
        url: 'https://www.nexusberry.com/',
        siteName: 'Events',
        images: [
          {
            url: 'https://www.nexusberry.com/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Events',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        creator: '@nexusberry',
      },
    }
  }
  return {
    title: event.meta?.title
      ? `${event.meta.title}`
      : 'Educational Event | NexusBerry Training & Solutions',
    description: event.meta?.description || 'Join our upcoming event at Nexusberry Training & Solutions.',
    keywords: (event?.meta as any)?.keywords
      ? Array.isArray((event?.meta as any).keywords)
        ? (event?.meta as any).keywords
        : [(event?.meta as any).keywords]
      : [
        'events',
        'event registration',
        'nexusberry events',
        'upcoming events',
        'Nexusberry Institute Event',
        'Event in Lahore',
      ], // 👈 default keywords for events

    alternates: {
      canonical: `https://www.nexusberry.com/events/${slug}`,
    },
    openGraph: {
      title: event.meta?.title
        ? `${event.meta.title}`
        : 'Educational Event | NexusBerry Training & Solutions',
      description: event.meta?.description ||
        'Join our expert-led educational event at NexusBerry Training & Solutions. Available in Lahore, Pakistan and online. Register now to enhance your skills.',
      url: `https://www.nexusberry.com/events/${slug}`,
      siteName: 'NexusBerry Training & Solutions',
      images: [
        {
          url: getImageURL(event.meta?.image) || 'https://www.nexusberry.com/nexusberry-logo.png',
          width: 1200,
          height: 630,
          alt: event.meta?.title
            ? `${event.meta.title} - NexusBerry Event`
            : 'NexusBerry Educational Event - Lahore, Pakistan',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@nexusberry',
      creator: '@nexusberry',
      title: event.meta?.title
        ? `${event.meta.title}`
        : 'Educational Event - NexusBerry Training & Solutions',
      description: event.meta?.description ||
        'Join our educational event at NexusBerry Training & Solutions. Register now!',
      images: [getImageURL(event.meta?.image) || 'https://www.nexusberry.com/nexusberry-logo.png'],
    },
    category: 'Education',
    classification: 'Educational Event',
    authors: [{ name: 'NexusBerry Training & Solutions' }],
    publisher: 'NexusBerry Training & Solutions',
  }
}

const queryEventsBySlug = async (slug: string) => {
  const api = unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'events',
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
          showInUI: {
            equals: true,
          },
        },
        select: {
          eventLeads: false
        },
      })
      return {
        event: result.docs?.[0],
      }
    },
    [`events-by-slug`, slug],
    {
      tags: ["events-details", `event-${slug}`]
    }
  )

  return await api();
}