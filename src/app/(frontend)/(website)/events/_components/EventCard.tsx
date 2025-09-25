import { Event } from '@/payload-types'
import Image from 'next/image'
import React from 'react'
import { imageSizes } from '@/app/(frontend)/(website)/_lib/ImageSizes'
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react'
import EventCardRegBtn from './EventCardRegBtn';
import { formatEventDateShort, formatEventTimeRange } from '../../_lib/utils/date';



const sizes = {
    '2xl': { padding: 42, cols: 4, gap: 10 },
    xl: { padding: 4, cols: 3, gap: 8 },
    lg: { padding: 4, cols: 2, gap: 8 },
    md: { padding: 4, cols: 2, gap: 8 },
    sm: { padding: 4, cols: 1, gap: 8 },
    xs: { padding: 4, cols: 1, gap: 8 },
}


const EventCard = ({ event }: { event: Event }) => {
    return (
        <div key={event.id} className="space-y-2  ring-2 ring-foreground rounded-xl bg-card">
            <div className="w-full aspect-[858/432] relative">
                <Link href={`/events/${event.slug}`}>
                    <Image
                        src={typeof event.image === 'object' ? (event.image?.url ?? '/white-bg-favicon.jpg') : '/white-bg-favicon.jpg'}
                        fill
                        alt={typeof event.image === 'object' ? (event.image?.alt ?? event.title) : event.title}
                        className="rounded-xl"
                        sizes={imageSizes(sizes)}
                        loading="lazy"
                    />
                </Link>
            </div>

            <div className="space-y-4 p-4 flex flex-col ">
                <h2 className="text-[1.1rem] font-semibold leading-7 h-14 line-clamp-2 ">
                    <Link href={`/events/${event.slug}`}>
                        {event.title}
                    </Link>
                </h2>

                <div className="space-y-3">
                    <div className="flex  items-center gap-2">
                        <Calendar size={18} className="inline" />
                        <span className="text-sm">{formatEventDateShort(event.startDateTime)}</span>
                    </div>

                    <div className="flex  items-center gap-2">
                        <Clock size={18} className="inline" />
                        <span className="text-sm">
                            {formatEventTimeRange(event.startDateTime, event.endTime)}
                        </span>
                    </div>
                </div>

                <EventCardRegBtn
                    eventId={event.id}
                    title={event.title}
                    slug={event.slug as string}
                    startDateTime={event.startDateTime}
                    endTime={event.endTime}
                />
            </div>
        </div>
    )
}

export default EventCard