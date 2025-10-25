import { getPayload } from 'payload'
import config from '@payload-config'


export const getPayloadMesseges = async () => {
  const payload = await getPayload({ config })
    const messages = await payload.find({
        collection: 'messages',
        sort: '-updatedAt'
    });
    return messages.docs;
  }

