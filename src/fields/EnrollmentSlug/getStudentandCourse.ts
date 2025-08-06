"use server"

import config from "@payload-config"
import { getPayload } from "payload"

// Define the collections type
type Collection = 'students' | 'training-courses'

// Define the select types for each collection
type StudentSelect = {
  fullName: boolean
}

type CourseSelect = {
  slug: boolean
}

// Union type for select based on collection
type SelectType<T extends Collection> = T extends 'students' ? StudentSelect : CourseSelect

const payload = await getPayload({ config })

export const getData = async <T extends Collection>(
  id: string | number,
  collection: T,
  select: SelectType<T>
) => {
  const data = await payload.findByID({
    collection,
    id,
    depth: 0,
    select
  })
  return data
}
