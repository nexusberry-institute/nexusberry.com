'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export const getInstructors = async () => {
    const payload = await getPayload({ config })

    const instructors = await payload.find({
        collection: 'instructors',
        depth: 1,
        sort: '-createdAt',
        limit: 100,
    })

    // console.log("Results", instructors)

    return instructors.docs
}
export default getInstructors