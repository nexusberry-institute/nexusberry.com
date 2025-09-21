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
          Event
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
            <AlreadyRegisteredTotal slug={event.slug as string} />
          </div>
        </div>

        {/* Mobile Registration Button */}
        {/* <div className="lg:hidden pt-4">
          {isRegistered ? (
            <Button
              onClick={() => {
                if (slug) {
                  router.push(`/events/${slug}/live-stream`)
                }
              }}
              className="w-full bg-primary-400 hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300 text-background"
            >
              Visit Live Stream
            </Button>
          ) : (
            <Button
              onClick={() => setIsOpenModel(true)}
              disabled={new Date(startDateTime) < new Date()}
              className="w-full bg-primary-400 hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300 text-background"
            >
              {new Date(startDateTime) < new Date()
                ? 'Registrations Closed'
                : 'Register for free!!'}
            </Button>
          )}
        </div> */}
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
