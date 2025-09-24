import React, { Suspense } from 'react'
import TimeSlote from './TimeSlote'
import { Certificate } from '@/app/(frontend)/(website)/_assets/images'
import Image from 'next/image'
import { UserCheck } from 'lucide-react'
import { Event } from '@/payload-types'
import EventRegistration from './EventRegistration'
import AlreadyRegisteredTotal from './AlreadyRegisteredTotal'



export default async function Hero({
  event,
}: {
  event: Event
}) {
  const startDateTime = event.startDateTime || new Date().toISOString()
  const endTime = event.endTime || null


  return (
    <div className="p-8 bg-primary-700 grid grid-cols-2 max-lg:grid-cols-1  ">
      <div className="text-background space-y-8 max-sm:space-y-6">
        <h2 className="text-[1.6rem] leading-5 font-light max-lg:text-center">
          {event.label}
        </h2>

        <h1 className="font-semibold text-xl md:text-4xl max-lg:text-center ">{event.title || "Event"}</h1>
        <TimeSlote
          startDateTime={startDateTime}
          endTime={endTime}
        />

        {/* Certificate and Participants in horizontal line */}
        <div className="flex gap-6 items-center max-lg:justify-center max-lg:flex-col max-lg:gap-4">
          <div className="flex gap-2 items-center">
            <Image src={Certificate} alt="certificate" sizes="28px" />
            <span className="text-lg">Certificate Included</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserCheck />
            <AlreadyRegisteredTotal id={event.id} />
          </div>
        </div>
      </div>

      <EventRegistration
        eventId={event.id}
        slug={event.slug ?? null}
        startDateTime={startDateTime}
        endTime={endTime}
      />
    </div>
  )
}
