"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { redirect } from "next/navigation"

export async function joinClass(formData: FormData) {
  try {
    const payload = await getPayload({ config })

    const classId = formData.get("classId")
    const enrollmentId = formData.get("enrollmentId")

    if (!classId) {
      throw new Error("Unable to Join Class. Please try again in few secounds or refresh the page")
    }

    // Fetch the class to get the online link
    const attendanceData = await payload.findByID({
      collection: "attendance",
      id: classId as string,
      depth: 0
    })

    if (!attendanceData || !attendanceData.onlineClassLink) {
      throw new Error("This Class does not exist any more.")
    }

    // If we have an enrollment ID, mark attendance
    if (enrollmentId) {
      // Check if attendance is already marked
      const { docs: existingAttendance } = await payload.find({
        collection: "attendance-details",
        where: {
          and: [
            { attendance: { equals: classId } },
            { enrollment: { equals: enrollmentId } }
          ]
        },
        limit: 1
      })

      // Only create attendance record if one doesn't exist
      if (!existingAttendance.length) {
        await payload.create({
          collection: "attendance-details",
          data: {
            attendance: Number(classId),
            enrollment: Number(enrollmentId),
            medium: "ONLINE",
            status: "PRESENT"
          }
        })
      }
    }

    return attendanceData.onlineClassLink
  } catch (error) {
    console.error("Error joining class:", error)
    throw new Error(error instanceof Error ? error.message : "Check Your internet Connection and try Again")
  }
}