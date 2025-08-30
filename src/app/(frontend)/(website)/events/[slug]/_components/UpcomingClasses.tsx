import Image from 'next/image'
import React from 'react'
import { Calendar, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { imageSizes } from '@/app/(frontend)/(website)/_lib/ImageSizes'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { format } from 'date-fns'

export const queryEvents = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: configPromise })
    const events = await payload.find({
      collection: 'events',
      limit: 3,
      pagination: false,
      select: {
        title: true,
        image: true,
        slug: true,
        startDateTime: true,
        endTime: true,
      },
      where: {
        slug: {
          not_equals: slug,
        },
        startDateTime: {
          greater_than_equal: new Date(),
        },
        showInUI: {
          equals: true,
        },
      },
    })
    return events.docs || null
  },
  ['events'],
  { tags: ['events'] }
)

const sizes = {
  '2xl': { padding: 42, cols: 4, gap: 10 },
  xl: { padding: 4, cols: 3, gap: 8 },
  lg: { padding: 4, cols: 2, gap: 8 },
  md: { padding: 4, cols: 2, gap: 8 },
  sm: { padding: 4, cols: 1, gap: 8 },
  xs: { padding: 4, cols: 1, gap: 8 },
}


export default async function UpcomingClasses({ 
  slug, 
  eventLabel 
}: { 
  slug: string,
  eventLabel?: string 
}) {
  const upcomingEvents = await queryEvents(slug)

  return (
    <div className="mt-20 max-sm:mt-10 mb-6" >
      <div className="flex justify-between items-center mb-10 lg:px-10 px-4 max-lg:flex-col max-lg:space-y-4">
        <h2 className="text-4xl font-semibold leading-[48px] max-sm:text-center max-md:text-[32px] ">
          Upcoming Events
        </h2>
        <Link href="/events" className="inline-block text-sm text-primary-400 font-bold">
          See all the Events
          <ChevronRight className="inline-block stroke-primary-400" size={18} />
        </Link>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 px-4 lg:px-10 gap-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="space-y-2 ring-2 ring-foreground rounded-xl bg-card">
              {/* Existing event card content */}
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
              <div className="space-y-4 p-4">
                <h2 className="text-[1.1rem] font-semibold leading-7 h-14 line-clamp-2">{event.title}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="inline" />
                    <span className="text-sm">{format(new Date(event.startDateTime), 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="inline" />
                    <span className="text-sm">
                      {format(new Date(event.startDateTime), 'h:mm a')}{' '}
                      {event.endTime ? `- ${format(new Date(event.endTime), 'h:mm a')}` : ''}
                    </span>
                  </div>
                </div>
                <Link href={`/events/${event.slug}`} className="block pt-10" aria-label="Read more">
                  <Button className="w-full rounded-xl hover:bg-primary-400 border-2 border-foreground text-background hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-300 bg-primary">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mx-auto px-4 py-12 text-center">
            <div className="bg-card rounded-xl border border-primary p-8 max-w-md mx-auto">
              <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Upcoming Events</h2>
              <p className="text-muted-foreground mb-6">
                We&#39;re currently planning new {(eventLabel || 'MASTERCLASS').toLowerCase()}. Check back soon or follow us on social media to stay updated about our upcoming events.
              </p>
              <Link href="/events" className="inline-block">
                <Button className="rounded-xl hover:bg-primary-400 border-2 border-foreground text-background hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-300 bg-primary">
                  Browse Past Events
                </Button>
              </Link>
            </div>
          </div>


        </>
      )}
    </div>
  )
}
