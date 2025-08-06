import { getPayload } from "payload";
import config from '@payload-config'

export default async function getTimeTable(){
  const payload = await getPayload({config})

  const data = await payload.find({
    collection: 'time-table',
    depth: 1,
    select: {
      createdAt: false,
      updatedAt: false,
    },
    populate: {
      batch: {
        slug: true
      }
    },
    sort: "id"
  })
  
  return data.docs
}