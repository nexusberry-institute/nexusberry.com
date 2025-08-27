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

        <div className="relative mx-auto w-fit flex flex-col gap-2 space-y-4 text-center lg:hidden">
          <div className="w-32 rounded-full bg-muted mx-auto  aspect-square overflow-hidden relative ">
            <Image
              src={
                typeof instructor === 'number'
                  ? '/nexusberryLogo.png'
                  : typeof instructor?.profileImage === 'object'
                    ? (instructor.profileImage.url ?? '/nexusberryLogo.png')
                    : '/nexusberryLogo.png'
              }
              alt={
                typeof instructor === 'number'
                  ? 'Nexusberry Instructor'
                  : typeof instructor?.profileImage === 'object'
                    ? (instructor.profileImage.alt ?? 'Nexusberry Instructor')
                    : 'Nexusberry Instructor'
              }
              className="object-cover"
              fill
              sizes="288px"
              priority
            />
          </div>

          <div>
            <h2 className="font-bold">
              {instructor && typeof instructor === 'object' && instructor.name
                ? instructor.name
                : 'Nexusberry Trainer'}
            </h2>
            <div>
              <span>
                {instructor && typeof instructor === 'object' && instructor.experience
                  ? `${instructor.experience}+ Years of Professional Experience`
                  : '18+ Years of Professional Experience'}
              </span>
            </div>
          </div>
          <Image
            src={ourMentor}
            alt="our mentor"
            className="absolute top-0 -left-12"
            sizes="107px"
          />
        </div>

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
