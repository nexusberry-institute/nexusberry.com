import type { Payload } from 'payload'

type AccessResult = {
  hasAccess: boolean
  reason: 'public' | 'admin' | 'teacher' | 'enrolled' | 'trial' | 'denied'
}

type AuthUser = {
  id: number
  roles?: (string | null)[] | null
  [key: string]: unknown
} | null | undefined

/**
 * Check if a user can access a specific tutorial.
 * Used in frontend server components and the secure-video API route.
 */
export async function canAccessTutorial(
  payload: Payload,
  user: AuthUser,
  tutorial: { id: number; accessType?: string | null; batches?: (number | { id: number })[] | null },
): Promise<AccessResult> {
  // Public tutorials are always accessible
  if (!tutorial.accessType || tutorial.accessType === 'public') {
    return { hasAccess: true, reason: 'public' }
  }

  // Protected tutorial — require auth
  if (!user) {
    return { hasAccess: false, reason: 'denied' }
  }

  // Check roles
  const roles = ('roles' in user && Array.isArray(user.roles)) ? user.roles as string[] : []

  // Superadmin / admin: full access
  if (roles.includes('superadmin') || roles.includes('admin')) {
    return { hasAccess: true, reason: 'admin' }
  }

  const tutorialBatchIds = (tutorial.batches || []).map((b) =>
    typeof b === 'object' && b !== null ? b.id : b,
  ).filter(Boolean) as number[]

  // Teacher: check if assigned to any of the tutorial's batches
  if (roles.includes('teacher')) {
    try {
      const teacherResult = await payload.find({
        collection: 'teachers',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
      })
      const teacher = teacherResult.docs[0]
      if (teacher && tutorialBatchIds.length > 0) {
        const batchResult = await payload.find({
          collection: 'batches',
          where: {
            and: [
              { id: { in: tutorialBatchIds } },
              { teachers: { contains: teacher.id } },
            ],
          },
          limit: 1,
          depth: 0,
          select: {},
        })
        if (batchResult.docs.length > 0) {
          return { hasAccess: true, reason: 'teacher' }
        }
      }
    } catch {
      // Fall through
    }
  }

  // Student: check enrollment or trial access
  if (roles.includes('student')) {
    try {
      const studentResult = await payload.find({
        collection: 'students',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
      })
      const student = studentResult.docs[0]
      if (student) {
        // Check trial access
        const trialIds = (Array.isArray(student.trialTutorials)
          ? student.trialTutorials.map((t) => (typeof t === 'object' && t !== null ? t.id : t))
          : []
        ).filter(Boolean) as number[]

        if (trialIds.includes(tutorial.id)) {
          return { hasAccess: true, reason: 'trial' }
        }

        // Check enrollment
        if (tutorialBatchIds.length > 0) {
          const enrollmentResult = await payload.find({
            collection: 'enrollments',
            where: {
              and: [
                { student: { equals: student.id } },
                { status: { equals: 'active' } },
                { batch: { in: tutorialBatchIds } },
              ],
            },
            limit: 1,
            depth: 0,
            select: {},
          })
          if (enrollmentResult.docs.length > 0) {
            return { hasAccess: true, reason: 'enrolled' }
          }
        }
      }
    } catch {
      // Fall through
    }
  }

  return { hasAccess: false, reason: 'denied' }
}
