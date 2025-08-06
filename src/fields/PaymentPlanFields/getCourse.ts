"use server"

import { getPayload } from "payload"
import config from "@payload-config"

export const getCourse = async (id: number) => {
  try {
    const payload = await getPayload({ config })
    return (await payload.findByID({
      collection: "training-courses",
      id,
      select: {
        fullPrice: true
      }
    })).fullPrice
  } catch (error) {
    throw error
  }
}