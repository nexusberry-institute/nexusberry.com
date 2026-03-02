import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

/**
 * Shared helper for LMS pages that need enrollment-based access.
 * Authenticates the user, verifies they are a student, and returns
 * the student record along with their enrolled batch IDs.
 */
export async function getStudentWithBatchIds() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') {
    redirect('/login')
  }

  const user = authUser as User
  const roles = (user.roles as string[]) ?? []
  if (!roles.includes('student')) {
    redirect('/dashboard')
  }

  const studentResult = await payload.find({
    collection: 'students',
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 0,
  })

  const student = studentResult.docs[0]
  if (!student) {
    return { payload, student: null, batchIds: [] as number[] }
  }

  const enrollmentsResult = await payload.find({
    collection: 'enrollments',
    where: {
      student: { equals: student.id },
      status: { in: ['active', 'graduated'] },
    },
    depth: 0,
    limit: 50,
    pagination: false,
  })

  const batchIds = enrollmentsResult.docs
    .map((e) => (typeof e.batch === 'object' && e.batch !== null ? e.batch.id : e.batch))
    .filter(Boolean) as number[]

  return { payload, student, batchIds }
}
