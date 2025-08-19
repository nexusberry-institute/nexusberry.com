'use client'

import Image from 'next/image'
import React from 'react'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { imageSizes } from '@/app/(frontend)/(website)/_lib/ImageSizes'

import { Event } from '@/payload-types'

const sizes = {
  '2xl': { padding: 42, cols: 4, gap: 10 },
  xl: { padding: 4, cols: 3, gap: 8 },
  lg: { padding: 4, cols: 2, gap: 8 },
  md: { padding: 4, cols: 2, gap: 8 },
  sm: { padding: 4, cols: 1, gap: 8 },
  xs: { padding: 4, cols: 1, gap: 8 },
}

const isEventPassed = (time: string) => {
  const startDateTime = new Date(time)
  return startDateTime.getTime() < Date.now()
}

export default function EventCart({ eventsData }: { eventsData: Event[] }) {

  const [filteredEventsByDepartment, setFilteredEventsByDepartment] = React.useState('all')

  if (!eventsData.length) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center bg-card p-8 rounded-lg border border-border shadow-md">
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1 uppercase tracking-wide">No Upcoming Events</h3>
              <p className="text-muted-foreground">Stay tuned for exciting updates! We&#39;re working on new events.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredEvents = eventsData.filter((event) =>
    filteredEventsByDepartment === 'all' ||
    (event["department"] &&
      typeof event["department"] === "object" &&
      event["department"].title === filteredEventsByDepartment)
  )

  const filteredArray = eventsData
    .map(event => event["department"] && typeof event["department"] === "object" ? event["department"].title : undefined)
    .filter((title) => Boolean(title))

  const eventCategories = Array.from(new Set(filteredArray))

  return (
    <>
      <div className="container mx-auto flex  gap-2 px-4 flex-wrap  lg:px-10 mb-10 max-sm:mb-5">
        <Button
          onClick={() => setFilteredEventsByDepartment('all')}
          className={`${filteredEventsByDepartment === 'all' ? 'bg-primary text-card' : 'bg-card text-foreground'} 
          w-fit rounded-xl  border-2 border-foreground  hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-2000 hover:bg-primary hover:text-background`}
        >
          All Classes
        </Button>

        {!eventCategories.length
          ? ''
          : eventCategories.map((event, index) => (
            event && <Button
              key={index}
              onClick={() => setFilteredEventsByDepartment(event)}
              className={`${filteredEventsByDepartment === event ? 'bg-primary text-card' : 'bg-card text-foreground'}
               w-fit rounded-xl border-2 border-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-2000 hover:bg-primary hover:text-background`}
            >
              {event}{" "}({filteredArray.filter((str) => str === event).length})
            </Button>
          ))}
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 px-4 lg:px-10 gap-8">
        {filteredEvents.map((event, index) => (
          <div key={index} className="space-y-2  ring-2 ring-foreground rounded-xl bg-card">
            <div className="w-full aspect-[858/432] relative">
              <Image
                src={typeof event.image === 'object' ? (event.image?.url ?? '/placeholderImg.jpg') : '/placeholderImg.jpg'}
                fill
                alt={typeof event.image === 'object' ? (event.image?.alt ?? event.title) : event.title}
                className="rounded-xl"
                sizes={imageSizes(sizes)}
                loading="lazy"
              />
            </div>

            <div className="space-y-4 p-4 flex flex-col ">
              <h2 className="text-[1.1rem] font-semibold leading-7 h-14 line-clamp-2 ">
                {event.title}
              </h2>

              <div className="space-y-3">
                <div className="flex  items-center gap-2">
                  <Calendar size={18} className="inline" />
                  <span className="text-sm">{format(new Date(event.startDateTime), 'MMMM dd, yyyy')}</span>
                </div>

                <div className="flex  items-center gap-2">
                  <Clock size={18} className="inline" />
                  <span className="text-sm">
                    {format(new Date(event.startDateTime), 'h:mm a')}{' '}
                    {event.endTime ? `- ${format(new Date(event.endTime), 'h:mm a')}` : ''}
                  </span>
                </div>
              </div>

              <Link
                href={isEventPassed(event.startDateTime) ? '#' : `/events/${event.slug}`}
                className={`block   ${isEventPassed(event.startDateTime) ? 'cursor-not-allowed' : ''}`}
                aria-label="Read more"
              >
                <Button
                  disabled={isEventPassed(event.startDateTime)}
                  className={`w-full rounded-xl hover:bg-primary-400 border-2 border-foreground text-background hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] bg-primary `}
                >
                  {isEventPassed(event.startDateTime) ? 'Event ended' : 'Register Now'}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
