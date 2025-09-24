import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const queryEventById = async ({ id }: { id: number }) => {
    try {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.findByID({
            id,
            collection: 'events',
            select: {
                defaultParticipants: true,
                totalRegistrations: true,
            }
        })
        return result
    } catch (error) {
        return undefined
    }
}

const AlreadyRegisteredTotal = async ({ id }: { id: number }) => {
    const eventWithAttendee = await queryEventById({ id });
    console.log("eventWithAttendee: ", eventWithAttendee);
    const participantCount = (eventWithAttendee?.defaultParticipants || 0) + (eventWithAttendee?.totalRegistrations || 0)

    return (
        <span className='text-lg'>{participantCount ?? 2618} already registered</span>
    )
}

export default AlreadyRegisteredTotal