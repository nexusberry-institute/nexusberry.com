import type { Access, Where } from 'payload'
import { checkRole } from './checkRole'

const publicOnly: Where = { accessType: { equals: 'public' } }

export const tutorialReadAccess: Access = async ({ req }) => {
  const { user, payload } = req

  // Superadmin / admin: see everything
  if (user && checkRole(['superadmin', 'admin'], user)) {
    return true
  }

  // Anonymous or non-role-based user: public only
  if (!user || !('roles' in user) || !Array.isArray(user.roles)) {
    return publicOnly
  }

  // Teacher: public + protected tutorials assigned to their batches
  if (user.roles.includes('teacher')) {
    try {
      const teacherResult = await payload.find({
        collection: 'teachers',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
      })
      const teacher = teacherResult.docs[0]
      if (teacher) {
        const batchResult = await payload.find({
          collection: 'batches',
          where: { teachers: { contains: teacher.id } },
          limit: 500,
          depth: 0,
          select: {},
        })
        const batchIds = batchResult.docs.map((b) => b.id)
        if (batchIds.length > 0) {
          const where: Where = {
            or: [
              { accessType: { equals: 'public' } },
              {
                and: [
                  { accessType: { equals: 'protected' } },
                  { batches: { in: batchIds } },
                ],
              },
            ],
          }
          return where
        }
      }
    } catch {
      // Fall through to public-only
    }
    return publicOnly
  }

  // Student: public + protected via enrollment or trial
  if (user.roles.includes('student')) {
    try {
      // Get trial tutorial IDs from user record
      const fullUser = await payload.findByID({ collection: 'users', id: user.id, depth: 0 })
      const trialIds = (Array.isArray(fullUser.trialTutorials)
        ? fullUser.trialTutorials.map((t) => (typeof t === 'object' && t !== null ? (t as { id: number }).id : t))
        : []
      ).filter(Boolean) as number[]

      // Get enrolled batch IDs
      const studentResult = await payload.find({
        collection: 'students',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
      })
      const student = studentResult.docs[0]

      let batchIds: number[] = []
      if (student) {
        const enrollmentResult = await payload.find({
          collection: 'enrollments',
          where: {
            and: [
              { student: { equals: student.id } },
              { status: { equals: 'active' } },
            ],
          },
          limit: 500,
          depth: 0,
          select: { batch: true },
        })
        batchIds = enrollmentResult.docs
          .map((e) => (typeof e.batch === 'object' && e.batch !== null ? e.batch.id : e.batch))
          .filter(Boolean) as number[]
      }

      const orConditions: Where[] = [{ accessType: { equals: 'public' } }]

      if (batchIds.length > 0) {
        orConditions.push({
          and: [
            { accessType: { equals: 'protected' } },
            { batches: { in: batchIds } },
          ],
        })
      }

      if (trialIds.length > 0) {
        orConditions.push({ id: { in: trialIds } })
      }

      const where: Where = { or: orConditions }
      return where
    } catch {
      // Fall through to public-only
    }
    return publicOnly
  }

  // Any other authenticated role: public only
  return publicOnly
}
