"use client";

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const EventCardRegBtn = ({
    title,
    slug,
    startDateTime,
    endTime
}: {
    title: string,
    slug: string,
    startDateTime: string,
    endTime: string | null | undefined
}) => {
    const [registeredUser, setRegisteredUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && slug) {
            const userDetails = localStorage.getItem(`${slug}-registration`)
            if (userDetails) {
                setRegisteredUser(JSON.parse(userDetails as any))
            }
        }
    }, [slug])

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
                const formatDateForGoogle = (dateString: string | null) => {
                    if (!dateString) return ''
                    return new Date(dateString)
                        .toISOString()
                        .replace(/[-:]/g, '')
                        .replace(/\.\d{3}/, '')
                }

                const start = formatDateForGoogle(startDateTime)
                const end = formatDateForGoogle(endTime)

                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${details}&location=${location}&dates=${start}/${end}`
                window.open(calendarUrl, '_blank')
            }}
        >
            <Calendar /> Add to Google Calendar
        </Button>
    )
};

export default EventCardRegBtn