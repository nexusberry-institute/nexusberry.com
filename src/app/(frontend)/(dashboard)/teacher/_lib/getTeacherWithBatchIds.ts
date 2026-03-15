import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

/**
 * Shared helper for teacher pages that need batch-based access.
 * Authenticates the user, verifies they are a teacher, and returns
 * the teacher record along with their assigned active batch IDs.
 */
export async function getTeacherWithBatchIds() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') {
    redirect('/login')
  }

  const user = authUser as User
  const roles = (user.roles as string[]) ?? []
  if (!roles.includes('teacher')) {
    redirect('/dashboard')
  }

  const teacherResult = await payload.find({
    collection: 'teachers',
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 0,
  })

  const teacher = teacherResult.docs[0]
  if (!teacher) {
    return { payload, teacher: null, batchIds: [] as number[] }
  }

  const batchesResult = await payload.find({
    collection: 'batches',
    where: {
      teachers: { contains: teacher.id },
      active: { equals: true },
    },
    depth: 0,
    limit: 50,
    pagination: false,
  })

  const batchIds = batchesResult.docs.map((b) => b.id)

  return { payload, teacher, batchIds }
}
