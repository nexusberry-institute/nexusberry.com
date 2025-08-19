import React from 'react'
import Hero from './_components/Hero'
import EventCart from './_components/EventCart'
import WhatsppCommunity from './_components/WhatsppCommunity'
import JoinUs from './_components/JoinUs'
import LearnerFeedback from './_components/LearnerFeedback'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next/types'
import ErrorCard from '../_components/ErrorCard'


const queryEvents = unstable_cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const globalEventData = await payload.findGlobal({
    slug: 'global-event-data',
  })

  const events = await payload.find({
    collection: 'events',
    limit: 100,
    pagination: false,
    where: {
      startDateTime: {
        greater_than_equal: new Date().toISOString(),
      }
    }
  })

  return {
    globalEventData,
    events: events.docs
  }
},
  ["events", "global-event-data"],
  {
    tags: ["events", "global-event-data"]
  }
)

export default async function Page() {
  try {
    const { events, globalEventData } = await queryEvents()
    return (
      <>
        <Hero eventData={events} attendee={globalEventData.totalAttendees} learner={globalEventData.completedByLearners} />
        <EventCart eventsData={events} />
        <WhatsppCommunity whatsappLink={globalEventData.whatsappCommunity} whatsappQrCode={globalEventData.whatsappQR} />
        <JoinUs />
        <LearnerFeedback />
      </>
    )

  } catch (error) {
    return <ErrorCard error={error} />
  }
}


export function generateMetadata(): Metadata {
  return {
    title: `Events`,
    description: "This is events page that all events show here you can register from here",
    keywords: ["events", "event registration", "nexusberry events", "upcoming events"], // ✅ keywords
    alternates: {
      canonical: "https://www.nexusberry.com/events", // ✅ canonical URL
    },
    openGraph: {
      title: 'Events',
      description: 'Events - This is events page here you can register from here',
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