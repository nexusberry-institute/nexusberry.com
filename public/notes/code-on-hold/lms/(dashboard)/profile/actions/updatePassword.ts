"use server"
import { getPayload } from "payload"
import config from "@payload-config"

export const updatePassword = async (data: any, userId: number) => {
  const payload = await getPayload({ config })
  const user = await payload.findByID({
    collection: "users",
    id: userId,
    showHiddenFields: true,
  })

  console.log(user)
}