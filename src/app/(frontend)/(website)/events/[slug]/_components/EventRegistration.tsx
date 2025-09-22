"use client";

import React, { useEffect, useState } from 'react'
import WebEventRegistration from './WebEventRegistration';

const EventRegistration = ({
    eventId,
    slug,
    startDateTime,
    endTime
}: {
    eventId: number,
    slug: string | null,
    startDateTime: string,
    endTime: string | null
}) => {
    const [registeredUser, setRegisteredUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && slug) {
            const userDetails = localStorage.getItem(`${slug}-registration`)
            setRegisteredUser(JSON.parse(userDetails as any))
        }
    }, [slug])

    return (
        <>
            <div className="mt-5 flex items-center justify-center">
                <div className="sm:w-[100%] md:w-[50%] lg:w-[70%]">
                    <WebEventRegistration
                        registeredUser={registeredUser}
                        eventId={eventId}
                        slug={slug}
                        startDateTime={startDateTime}
                        endTime={endTime}
                    />
                </div>
            </div>
        </>
    )
}

export default EventRegistration