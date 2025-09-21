"use client";

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { EventModel } from './EventModel';

const MobileEventRegistration = ({
    isRegistered,
    slug,
    startDateTime,
    eventId
}: {
    isRegistered: boolean,
    slug: string,
    startDateTime: string,
    eventId: number
}) => {
    const [isOpenModel, setIsOpenModel] = useState(false)
    const router = useRouter();

    return (
        <>

            <div className="lg:hidden pt-4">
                {isRegistered ? (
                    <Button
                        onClick={() => {
                            if (slug) {
                                router.push(`/events/${slug}/live-stream`)
                            }
                        }}
                        className="w-full bg-primary-400 hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300 text-background"
                    >
                        Visit Live Stream
                    </Button>
                ) : (
                    <Button
                        // onClick={() => setIsOpenModel(true)}
                        disabled={new Date(startDateTime) < new Date()}
                        className="w-full bg-primary-400 hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300 text-background"
                    >
                        {new Date(startDateTime) < new Date()
                            ? 'Registrations Closed'
                            : 'Register for free!!'}
                    </Button>
                )}
            </div>
            {isOpenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} />}
        </>
    )
}

export default MobileEventRegistration