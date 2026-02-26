'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getCourses() {
  const payload = await getPayload({ config })
  const courses = await payload.find({
    collection: 'web-courses',
    limit: 100,
    depth: 0,
    sort: 'title',
    select: {
      title: true,
      price: true,
      duration: true,
    },
  })
  return courses.docs.map((c) => ({
    id: c.id as number,
    title: c.title,
    price: c.price,
    duration: c.duration,
  }))
}
