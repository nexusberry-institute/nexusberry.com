'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { CountdownTimer } from '@/components/CountDownTimer'
import { EventModel } from './EventModel'

export default function RegistrationFooter({
  startDateTime,
  endTime,
  eventId,
  slug,
}: {
  startDateTime: string
  endTime: string | null | undefined
  slug: string | null | undefined
  eventId: number
}) {
  const [showFooter, setShowFooter] = useState(true)
  const [isOPenModel, setIsOpenModel] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const userDetails = localStorage.getItem(`${slug}-registration`)
      console.log('Fetched userDetails from localStorage for slug:', slug, userDetails)
      setIsRegistered(!!userDetails)
    }
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const element = document.getElementById('show_footer')
      
      if (element) {
        const position = element.getBoundingClientRect()
        const isNearBottom = position.top <= window.innerHeight + 100
        
        // Show footer if:
        // 1. User is scrolling up, OR
        // 2. User is near the bottom of the page (where show_footer element is visible)
        if (currentScrollY < lastScrollY || isNearBottom) {
          setShowFooter(true)
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Hide footer when scrolling down and not at top
          setShowFooter(false)
        }
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const timeLeft = CountdownTimer({ date: startDateTime })

  return (
    <>
      <div
        id="footer"
        className={`flex justify-between items-center bg-primary-700 px-4 py-6 max-sm:py-4 sticky bottom-0 max-lg:flex-col max-lg:gap-4 transition-transform duration-300 ${showFooter ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex gap-8 items-center ">
          <div className="flex font-bold gap-4 p-4 ring-1 bg-background text-foreground ring-foreground justify-center items-center w-[30rem] rounded-full  shadow-[5px_5px_0px_rgba(181,20,36,0.9)] hover:shadow-none duration-300 max-lg:hidden">
            <div className="flex items-center gap-2 max-lg:justify-center">
              <Calendar size={18} className="inline" />
              <span>{format(new Date(startDateTime), 'MMMM dd, yyyy')}</span>
            </div>
            <span className="text-secondary-500 font-extralight text-4xl max-lg:hidden">|</span>
            <div className="flex  items-center gap-2 max-lg:justify-center">
              <Clock size={18} className="inline" />
              <span>
                {format(new Date(startDateTime), 'h:mm a')}{' '}
                {endTime ? `- ${format(new Date(endTime), 'h:mm a')}` : ''}
              </span>
            </div>
          </div>
          <div className="flex gap-2  text-card lg:hidden   ">
            <div className="flex  items-center gap-2 max-lg:justify-center">
              <Calendar size={18} className="inline" />
              <span>{format(new Date(startDateTime), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex  items-center gap-2 max-lg:justify-center">
              <Clock size={18} className="inline" />
              <span>
                {format(new Date(startDateTime), 'h:mm a')} -{' '}
                {endTime ? format(new Date(endTime), 'h:mm a') : ''}
              </span>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-semibold max-xl:hidden text-background">
            <div className="flex flex-col gap-1  items-center">
              <div>{timeLeft.days}</div>
              <div className="text-sm font-semibold">Days</div>
            </div>
            <div>:</div>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.hours}</div>
              <div className="text-sm font-semibold">Hours</div>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.minutes}</div>
              <div className="text-sm font-semibold">Minuts</div>
            </div>
            <span>:</span>
            <div className="flex flex-col gap-1 items-center">
              <div>{timeLeft.seconds}</div>
              <div className="text-sm font-semibold">seconds</div>
            </div>
          </div>
        </div>
        {/* Registration / Live stream button */}
        {isRegistered ? (
          <Button
            onClick={() => {
              if (slug) {
                window.open(`/events/${slug}/live-stream`, '_blank', 'noopener,noreferrer')
              }
            }}
            className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
          >
            Visit Live Stream
          </Button>
        ) : (
          <Button
            onClick={() => setIsOpenModel(true)}
            disabled={startDateTime < new Date().toISOString()}
            className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
          >
            {startDateTime < new Date().toISOString()
              ? 'Registrations Closed'
              : 'Register for free!!'}
          </Button>
        )}
      </div>
      {isOPenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />}
    </>
  )
}
