// import { getPayload } from "payload";
// import configPromise from '@payload-config'
// import DemoFormWrapper from "./DemoFormWrapper";
// import EventCard from "./event/EventCard";
// import DemoBookingSuccess from "./DemoBookingSuccess";

// const DemoBookingWrapper = async ({ id, slug }: { id: number, slug: string }) => {
//     const activeEvent = await getActiveEvent(id);
//     console.log("activeEvent: ", activeEvent);

//     if (activeEvent) {
//         return (
//             <>
//                 <EventCard
//                     label={activeEvent.label}
//                     title={activeEvent.title}
//                     startDateTime={activeEvent.startDateTime}
//                     endTime={activeEvent.endTime as string}
//                     registeredCount={(activeEvent.defaultParticipants || 0) + (activeEvent.totalRegistrations || 0)}
//                     certificateIncluded={activeEvent.hasCertificate as boolean}
//                     detailHref={`/events/${activeEvent.slug}`}
//                 />
//             </>
//         )
//     };

//     return (
//         <>
//             <DemoFormWrapper courseId={id} slug={slug}>
//                 <DemoBookingSuccess />
//             </DemoFormWrapper>
//         </>
//     )
// };

// const getActiveEvent = async (id: number) => {
//     const payload = await getPayload({ config: configPromise })
//     const currentTime = new Date();

//     const events = await payload.find({
//         collection: 'events',
//         where: {
//             and: [
//                 {
//                     courses: {
//                         contains: id
//                     }
//                 },
//                 {
//                     endTime: {
//                         greater_than: currentTime,
//                     },
//                 },
//             ],
//         },
//         select: {
//             courses: false,
//             department: false,
//             eventLeads: false,
//             instructor: false,
//             learningOutcomes: false,
//             meta: false,
//         },
//         depth: 0,
//         limit: 1,
//         sort: 'startDateTime'
//     });

//     return events.docs[0] || null;
// };

// export default DemoBookingWrapper


"use client"

import { useEffect, useState } from "react"
import DemoFormWrapper from "./DemoFormWrapper"
import EventCard from "./event/EventCard"
import DemoBookingSuccess from "./DemoBookingSuccess"
import { LoaderCircle } from "lucide-react"

interface ActiveEvent {
    label: string
    title: string
    startDateTime: string
    endTime: string
    defaultParticipants?: number
    totalRegistrations?: number
    hasCertificate?: boolean
    slug: string
}

const DemoBookingWrapper = ({ id, slug }: { id: number; slug: string }) => {
    const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActiveEvent = async () => {
            const currentTime = new Date().toISOString()

            try {
                const params = new URLSearchParams({
                    'where[and][0][courses][in][0]': id.toString(),
                    'where[and][1][endTime][greater_than]': currentTime,
                    'select[courses]': 'false',
                    'select[department]': 'false',
                    'select[eventLeads]': 'false',
                    'select[instructor]': 'false',
                    'select[learningOutcomes]': 'false',
                    'select[meta]': 'false',
                    'depth': '0',
                    'limit': '1',
                    'sort': 'startDateTime',
                })
                const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/events?${params.toString()}`

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                })

                if (!response.ok) {
                    setLoading(false)
                    return
                }

                const data = await response.json()
                const event = data.docs[0] || null

                setActiveEvent(event)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching active event:", error)
                setLoading(false)
            }
        }

        fetchActiveEvent()
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center bg-primary-600 padding-x max-sm:px-4 min-h-screen">
                <div className="text-white animate-spin"><LoaderCircle /></div>
            </div>
        )
    }

    if (activeEvent) {
        return (
            <>
                <EventCard
                    label={activeEvent.label}
                    title={activeEvent.title}
                    startDateTime={activeEvent.startDateTime}
                    endTime={activeEvent.endTime}
                    registeredCount={
                        (activeEvent.defaultParticipants || 0) +
                        (activeEvent.totalRegistrations || 0)
                    }
                    certificateIncluded={activeEvent.hasCertificate ?? false}
                    detailHref={`/events/${activeEvent.slug}`}
                />
            </>
        )
    }

    return (
        <>
            <DemoFormWrapper courseId={id} slug={slug} />
        </>
    )
}

export default DemoBookingWrapper