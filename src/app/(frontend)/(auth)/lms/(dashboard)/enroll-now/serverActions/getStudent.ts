"use server"

import { getPayload } from "payload";
import config from "@payload-config"
import { headers } from "next/headers";

export const getStudent = async () => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return {
      user: null,
    }
  }

  const { docs: [student] } = await payload.find({
    collection: "students",
    where: {
      user: {
        equals: user.id,
      }
    },
    select: {
      fullName: true,
    },
    limit: 1,
    pagination: false,
    depth: 0,
  })

  if (!student) {
    return {
      student: null,
    }
  }

  return {
    user,
    student
  }
}

