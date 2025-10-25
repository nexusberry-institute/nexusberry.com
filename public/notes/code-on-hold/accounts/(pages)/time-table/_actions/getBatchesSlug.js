import { getPayload } from "payload";
import config from '@payload-config'
export default async function getBatchesSlug() {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'batches',
    depth: 1,
    select: {
      slug: true
    },
  })
  return data.docs
}