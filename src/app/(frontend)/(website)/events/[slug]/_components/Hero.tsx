'use client'
import React, { useState } from 'react'
import TimeSlote from './TimeSlote'
import { Button } from '@/components/ui/button'
import { Certificate, ourMentor } from '@/app/(frontend)/(website)/_assets/images'
import Image from 'next/image'
import { UserCheck } from 'lucide-react'
import { EventModel } from './EventModel'
import { Instructor } from '@/payload-types'
import ModelForm from './ModelForm'

export default function Hero(props: {
  // backward compatible props
  title?: string
  instructor?: number | Instructor | null
  startDateTime?: string
  endTime?: string | null
  eventId?: number
  slug?: string | null
  // new props for dynamic counts
  eventData?: any[]
  attendee?: number
  learner?: number
}) {
  const { eventData, attendee, learner } = props
  // derive values from eventData if present (server-side pass)
  const eventObj = Array.isArray(eventData) && eventData.length > 0 ? eventData[0] : null
  const title = props.title ?? eventObj?.title ?? 'Event'
  const instructor = props.instructor ?? eventObj?.instructor
  const startDateTime = props.startDateTime ?? eventObj?.startDateTime ?? new Date().toISOString()
  const endTime = props.endTime ?? eventObj?.endTime ?? null
  const eventId = props.eventId ?? eventObj?.id ?? 0
  const slug = props.slug ?? eventObj?.slug ?? null
  const [isOPenModel, setIsOpenModel] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const userDetails = localStorage.getItem(`${slug}-registration`)
      console.log('Fetched userDetails from localStorage for slug:', slug, userDetails)
      setIsRegistered(!!userDetails)
    }
  }, [slug])

  return (
    <div className="p-8 bg-primary-700 grid grid-cols-2 max-lg:grid-cols-1  ">
      <div className="text-background space-y-8 max-sm:space-y-6">
        <h2 className="text-[1.6rem] leading-5 font-light max-lg:text-center">
          {eventObj?.label ?? 'MASTERCLASS'}
        </h2>

        <h1 className="font-semibold text-xl md:text-4xl max-lg:text-center ">{title}</h1>
        <TimeSlote startDateTime={startDateTime} endTime={endTime} />

        {/* Certificate and Participants in horizontal line */}
        <div className="flex gap-6 items-center max-lg:justify-center max-lg:flex-col max-lg:gap-4">
          <div className="flex gap-2 items-center">
            <Image src={Certificate} alt="certificate" sizes="28px" />
            <span className="text-lg">Certificate Included</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserCheck />
            <span className="text-lg">{attendee ?? 2618} already registered</span>
          </div>
        </div>

        {/* Mobile Registration Button */}
        <div className="lg:hidden pt-4">
          {isRegistered ? (
            <Button
              onClick={() => {
                if (slug) {
                  window.open(`/events/${slug}/live-stream`, '_blank', 'noopener,noreferrer')
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
        </div>
      </div>
      <div className="max-lg:hidden flex items-center justify-center">
        <div className="w-[70%]">
          <ModelForm 
            eventId={eventId} 
            slug={slug} 
            redirect={false} 
            showLeftGraphic={false}
            showSuccessState={true}
            startDateTime={startDateTime}
            endTime={endTime}
          />
        </div>
      </div>
      {isOPenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />}
    </div>
  )
}
