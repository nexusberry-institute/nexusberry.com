"use server"

import { getPayload } from "payload"
import config from "@payload-config"

export const getTimeTable = async (batchesId: number[]) => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: "time-table",
      where: {
        batch: {
          in: batchesId
        }
      },
      populate: {
        batches: {
          slug: true
        }
      },
      depth: 1,
      pagination: false
    })

    return docs
  } catch (error) {
    throw error
  }
}