import React, { Suspense } from 'react'
import Hero from './_components/Hero'
import EventCart from './_components/EventCart'
import WhatsppCommunity from './_components/WhatsppCommunity'
import JoinUs from './_components/JoinUs'
import LearnerFeedback from './_components/LearnerFeedback'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next/types'
import { EventsGridSkeleton } from './_components/EventListSkeleton'

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: "NexusBerry Events | Workshops in Lahore, Pakistan & Online",
    description:
      "Explore upcoming NexusBerry events, workshops, and training sessions at our Lahore campus in Pakistan and online. Join expert-led coaching programs, enhance your skills, and register today.",
    keywords: [
      "NexusBerry events",
      "NexusBerry Lahore events",
      "events in Lahore Pakistan",
      "workshops in Lahore",
      "training sessions Lahore Pakistan",
      "coaching institute Lahore",
      "upcoming events in Lahore",
      "student workshops Pakistan",
      "skill development Lahore Pakistan",
      "online coaching events",
      "NexusBerry online workshops",
      "Pakistan seminars and webinars",
    ],
    alternates: {
      canonical: "https://www.nexusberry.com/events",
    },
    openGraph: {
      title: "NexusBerry Events | Lahore, Pakistan & Online",
      description:
        "Join NexusBerry Training Institute’s events, workshops, and training programs. Available onsite at our Lahore campus and online for learners across Pakistan. Register now.",
      url: "https://www.nexusberry.com/events",
      siteName: "NexusBerry Training & Solutions",
      images: [
        {
          url: "https://www.nexusberry.com/nexusberry-logo.png",
          width: 1200,
          height: 630,
          alt: "NexusBerry Events - Lahore, Pakistan & Online",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@nexusberry",
      title: "NexusBerry Events – Lahore & Online",
      description:
        "Stay updated with NexusBerry Training Institute’s upcoming events, workshops, and coaching sessions. Attend onsite in Lahore, Pakistan or join online from anywhere.",
      images: ["https://www.nexusberry.com/nexusberry-logo.png"],
    },
    category: "Education",
    classification: "Educational Events",
    authors: [{ name: "NexusBerry Training & Solutions" }],
    publisher: "NexusBerry Training & Solutions",
  }
}

const queryEvents = unstable_cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const globalEventData = await payload.findGlobal({
    slug: 'global-event-data',
  })

  return globalEventData;
},
  ["global-event-data"],
  {
    tags: ["global-event-data"]
  }
)

export default async function Page() {
  const globalEventData = await queryEvents();

  return (
    <>
      <Hero eventData={[]} attendee={globalEventData.totalAttendees} learner={globalEventData.completedByLearners} />
      <Suspense fallback={<EventsGridSkeleton count={6} />}>
        <EventCart />
      </Suspense>
      <WhatsppCommunity whatsappLink={globalEventData.whatsappCommunity} whatsappQrCode={globalEventData.whatsappQR} />
      <JoinUs />
      <LearnerFeedback />
    </>
  )
}