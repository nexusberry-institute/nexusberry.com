"use server"


import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { getPayload } from "payload"
import config from "@payload-config"
import { Enrollment, Module } from "@/payload-types"

export type TEnrollment = {
  id: number
  slug: string
  completionState: Enrollment["completionState"]
  certificateStatus: Enrollment["certificateStatus"]
  admissionDate?: string | null
  "training-course": {
    id: number
    title: string
  }
  discountCode?: {
    id: number
  }
  batchEnrollments?: TBatchEnrollment[] | null | undefined
  batches: {
    slug: string
    active: boolean
  }
  relatedFeeReciepts: {
    docs: TFeeReceipt[]
  }
}

export type TBatchEnrollment = {
  id?: string | null
  batch?: {
    id?: number | null
    slug: string
    active: boolean
  } | null
  modules?: Module[] | null
  mode?: ("ONLINE" | "PHYSICAL" | "HYBRID") | null
}

export type TFeeReceipt = {
  id: number
  verified: boolean
  amount: number
  status: "PENDING" | "RECEIVED" | "DEAD"
  paidMethod?: "CASH" | "BANK" | "JAZZCASH" | "EASYPAISA"
  dueDate: string
  payDate?: string
}


export const getStudentEnrollments = async (headers: ReadonlyHeaders) => {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })
    if (!user) {
      return []
    }

    const { docs: enrollments } = await payload.find({
      collection: "enrollments",
      where: {
        "student.user": {
          equals: user.id,
        }
      },
      select: {
        student: false,
        admissionFee: false,
        freezeDate: false,
        unfreezeDate: false,
        isSuspended: false,
        note: false,
        selectedPaymentPlan: false
      },
      populate: {
        "training-courses": {
          title: true,
        },
        batches: {
          slug: true,
          active: true,
        },
        "fee-receipts": {
          amount: true,
          verified: true,
          status: true,
          paidMethod: true,
          dueDate: true,
          payDate: true,
        },
        "discount-codes": {

        }
      }
    })

    return enrollments as unknown as TEnrollment[]
  } catch (error) {
    console.error("Error fetching student enrollments:", error)
    return []
  }
}