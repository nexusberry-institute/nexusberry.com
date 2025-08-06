'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { CountdownTimer } from '@/components/CountDownTimer'
import { EventModel } from './EventModel'

export default function RegistrationFooter({ startDateTime, endTime, eventId, slug }: {
  startDateTime: string, endTime: string | null | undefined,
  slug: string | null | undefined, eventId: number
}
) {
  const [showFooter, setShowFooter] = useState(false)
  const [isOPenModel, setIsOpenModel] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('show_footer')
      if (element) {
        const position = element.getBoundingClientRect()
        setShowFooter(position.top + 50 <= window.innerHeight)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const timeLeft = CountdownTimer({ date: startDateTime })

  return (
    <>
      <div
        id="footer"
        className={`flex justify-between items-center bg-primary-700 px-4 py-6 max-sm:py-4 sticky bottom-0 max-lg:flex-col max-lg:gap-4  duration-300 ${showFooter ? '' : 'translate-y-32'}`}
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
                {format(new Date(startDateTime), 'h:mm a')} {endTime ? `- ${format(new Date(endTime), 'h:mm a')}` : ''}
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
                {format(new Date(startDateTime), 'h:mm a')} - {endTime ? format(new Date(endTime), 'h:mm a') : ""}
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
        <Link
          href="#"
          aria-label="register yourself"
          className="max-lg:mx-auto max-lg:w-1/2 max-sm:w-full "
        >
          <Button
            disabled={startDateTime < new Date().toISOString()}
            onClick={() => setIsOpenModel(true)}
            className="bg-primary-400  w-fit max-lg:w-full max-lg:mx-auto hover:bg-primary-400 font-bold py-8 max-lg:py-6 px-8 rounded-xl hover:shado-1px-4px-0px-rgb hover:shadow-[2px_2px_0px_rgba(255,255,0,0.9)]"
          >
            {startDateTime < new Date().toISOString() ? "Registerations Closed" : "Register for free!!"}
          </Button>
        </Link>

      </div>
      {isOPenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />}
    </>
  )
}
