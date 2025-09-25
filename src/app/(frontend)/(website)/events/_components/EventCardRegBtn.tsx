"use client";

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { formatPakistanTime } from '../../_lib/utils/date';

const EventCardRegBtn = ({
    eventId,
    title,
    slug,
    startDateTime,
    endTime
}: {
    eventId: number,
    title: string,
    slug: string,
    startDateTime: string,
    endTime: string | null | undefined
}) => {
    const [registeredUser, setRegisteredUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userDetails = localStorage.getItem(`${eventId}-registration`)
            if (userDetails) {
                setRegisteredUser(JSON.parse(userDetails as any))
            }
        }
    }, [eventId])

    if (registeredUser)
        return <AddToGoogleCalender
            title={title}
            startDateTime={startDateTime}
            endTime={endTime ?? null}
        />

    return (
        <>
            <Link
                href={`/events/${slug}`}
                className={`block`}
                aria-label="Read more"
            >
                <Button
                    className={`w-full rounded-xl hover:bg-primary-400 border-2 border-foreground text-background hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] bg-primary `}
                >
                    Register Now
                </Button>
            </Link>
        </>
    )
}

const AddToGoogleCalender = ({
    title, startDateTime, endTime
}: {
    title: string, startDateTime: string, endTime: string | null
}) => {
    return (
        <Button
            className={`w-full rounded-xl border-2 border-foreground text-black hover:bg-white bg-white`}
            onClick={() => {
                const eventTitle = encodeURIComponent(title || 'Nexusberry Masterclass')
                const details = encodeURIComponent(
                    'Join the live Masterclass - upgrade your skills and shape your future.',
                )
                const location = encodeURIComponent('Online')

                const formatDateForGooglePakistan = (utcDateString: string | null): string => {
                    if (!utcDateString) return '';

                    // Convert UTC date to Pakistan time and format for Google Calendar
                    const pakistanDateTime = formatPakistanTime(utcDateString, "yyyyMMdd'T'HHmmss");
                    return pakistanDateTime;
                };

                const start = formatDateForGooglePakistan(startDateTime)
                const end = formatDateForGooglePakistan(endTime)

                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}&dates=${start}/${end}&ctz=Asia/Karachi`
                window.open(calendarUrl, '_blank')
            }}
        >
            <Calendar /> Add to Google Calendar
        </Button>
    )
};

export default EventCardRegBtn