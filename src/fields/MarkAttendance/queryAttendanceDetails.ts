"use server"
import { getPayload } from "payload"
import config from "@payload-config"

const payload = await getPayload({ config })

const getEnrollmentsByBatches = async (batchIds: number[], enrollmentIds: number[]) => {
  if (!batchIds.length) return []

  const { docs: enrollments } = await payload.find({
    collection: "enrollments",
    where: {
      id: { not_in: enrollmentIds },
      "batchEnrollments.batch": { in: batchIds },
      "batchEnrollments.mode": { not_equals: "ONLINE" },
      completionState: { equals: 'CONTINUE' },
      isSuspended: { not_equals: true }
    },
    select: {
      slug: true
    },
    depth: 0
  })

  return enrollments
}

const getAttendanceDetailsByIds = async (ids: number[]) => {
  if (!ids.length) return []

  const { docs: attendanceDetails } = await payload.find({
    collection: "attendance-details",
    select: {
      attendance: false,
      createdAt: false,
      updatedAt: false,
    },
    populate: {
      enrollments: {
        slug: true
      }
    },
    where: {
      id: {
        in: ids
      }
    }
  })

  return attendanceDetails as {
    id: number
    medium?: ("PHYSICAL" | "ONLINE") | null
    enrollment: {
      id: number
      slug: string
    }
    status?: ("PRESENT" | "ABSENT" | "LEAVE") | null;
  }[]
}

export const getAttendanceDetails = async (batchIds: number[], attendenceDetailIds: number[]) => {
  const attendenceDetails = await getAttendanceDetailsByIds(attendenceDetailIds)
  const enrollments = await getEnrollmentsByBatches(batchIds, attendenceDetails.map(detail => detail.enrollment.id))

  return [
    ...enrollments.map(enrollment => {
      return {
        enrollmentId: enrollment.id,
        attendenceDetailId: undefined,
        enrollmentSlug: enrollment.slug,
        medium: "PHYSICAL" as const,
        status: "ABSENT" as const
      }
    }),
    ...attendenceDetails.map(ad => {
      return {
        enrollmentId: ad.enrollment.id,
        attendenceDetailId: ad.id,
        enrollmentSlug: ad.enrollment.slug,
        medium: ad.medium,
        status: ad.status || "ABSENT"
      }
    })
  ]
}

export const updateAttendanceDetail = async (data: {
  status?: "PRESENT" | "ABSENT" | "LEAVE" | null;
  medium?: "PHYSICAL" | "ONLINE" | "HYBRID" | null;
  id: number;
}) => {
  const result = await payload.update({
    collection: "attendance-details",
    id: data.id,
    data: {
      status: data.status,
      medium: data.medium === "HYBRID" ? "PHYSICAL" : "ONLINE"
    }
  })
  return result
}