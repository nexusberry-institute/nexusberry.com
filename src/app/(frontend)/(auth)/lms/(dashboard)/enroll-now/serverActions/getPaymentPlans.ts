"use server"

import { getPayload } from "payload";
import config from "@/payload.config"

export const getPaymentPlans = async (ids: number[]) => {
  const payload = await getPayload({ config })
  return payload.find({
    collection: "payment-plans",
    where: {
      id: { in: ids }
    },
    depth: 0
  })
}