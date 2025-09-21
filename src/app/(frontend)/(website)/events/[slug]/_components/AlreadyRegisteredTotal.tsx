import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const queryEventsBySlug = async ({ slug }: { slug: string }) => {
    try {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.find({
            collection: 'events',
            limit: 1,
            pagination: false,
            where: {
                slug: {
                    equals: slug,
                },
                showInUI: {
                    equals: true,
                },
            },
            select: {
                defaultParticipants: true,
                totalRegistrations: true,
            }
        })
        return {
            event: result.docs?.[0],
        }
    } catch (error) {
        return { event: undefined }
    }
}

const AlreadyRegisteredTotal = async ({ slug }: { slug: string }) => {
    const { event: eventWithAttendee } = await queryEventsBySlug({ slug });
    const participantCount = (eventWithAttendee?.defaultParticipants || 0) + (eventWithAttendee?.totalRegistrations || 0)

    return (
        <span className='text-lg'>{participantCount ?? 2618} already registered</span>
    )
}

export default AlreadyRegisteredTotal