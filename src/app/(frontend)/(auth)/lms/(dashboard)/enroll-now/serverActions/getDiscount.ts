'use server'

import { getPayload } from "payload";
import config from "@/payload.config"

export const getDiscount = async (discountCode: string, courseId?: number, paymentPlanId?: number) => {
  const payload = await getPayload({ config })
  const response = await payload.find({
    collection: "discount-codes",
    where: {
      code: { equals: discountCode }
    },
    limit: 1,
    pagination: false,
    depth: 0
  })

  const discountPlan = response.docs[0]

  if (!discountPlan) {
    return {
      success: false,
      message: "Invalid discount code. Please check and try again.",
      discountPlan: null
    }
  }

  if (!discountPlan.isValid) {
    return {
      success: false,
      message: "This discount code has been deactivated. Please contact staff for assistance.",
      discountPlan: null
    }
  }

  if (discountPlan.expiryAt) {
    const currentDate = new Date()
    const expiryDate = new Date(discountPlan.expiryAt)

    if (currentDate > expiryDate) {
      return {
        success: false,
        message: `This discount code expired on ${expiryDate.toLocaleDateString()}. Please use a current code`,
        discountPlan: null
      }
    }
  }

  if (discountPlan.usageLimit && discountPlan.usageLimit === discountPlan.timesUsed) {
    return {
      success: false,
      message: "This discount code has reached its maximum usage limit. Please use a different code.",
      discountPlan: null
    }
  }

  if (discountPlan["training-course"] != courseId) {
    return {
      success: false,
      message: "This discount code is not valid for the selected course. Please select a different course or use another code.",
      discountPlan: null
    }
  }

  if (discountPlan.paymentPlan != paymentPlanId) {
    return {
      success: false,
      message: "This discount code is not valid for the selected payment plan. Please select a different payment plan or use another code.",
      discountPlan: null
    }
  }

  return {
    success: true,
    message: `Discount code "${discountCode}" applied successfully! Check payment plan to see applied discount`,
    discountPlan
  }
}