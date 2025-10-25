"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { headers } from "next/headers"

const payload = await getPayload({ config })

export const getLoggedInUser = async () => {
  try {
    return (await payload.auth({ headers: await headers() })).user
  } catch (error) {
    throw new Error("Unable to get User. Check Your Network Connection and try again in a few secounds" + error)
  }
}

export const getStudentByUserId = async (userId: number, username?: string | null, gmailUserName?: string | null) => {
  try {
    let { docs: [student] } = await payload.find({
      collection: "students",
      limit: 1,
      depth: 1,
      select: {
        user: false
      },
      populate: {
        "enrollments": {
          "training-course": true,
          relatedFeeReciepts: true,
          batchEnrollments: true,
        },
        media: {
          alt: true,
          url: true,
        }
      },
      pagination: false,
      where: {
        user: {
          equals: userId
        }
      }
    })

    if (!student) {
      student = await payload.create({
        collection: "students",
        data: {
          user: userId,
          fullName: username,
          gmail_username: gmailUserName
        }
      })

    }
    return student

  } catch (error) {
    console.error("Unable to get Student. Check your Network Connection and try again in a few secounds", error)
    return null
  }
}