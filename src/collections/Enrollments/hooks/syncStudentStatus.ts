import type { CollectionAfterChangeHook } from 'payload'

/**
 * When an enrollment is created or set to `active`,
 * auto-activate the linked student if they are `on-hold`.
 *
 * Does NOT override `withdrawn` — that requires manual admin action.
 */
export const syncStudentStatus: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status !== 'active') return
  // Skip if status didn't change (update to same value)
  if (previousDoc && previousDoc.status === 'active') return

  const studentId = typeof doc.student === 'object' ? doc.student.id : doc.student
  if (!studentId) return

  const student = await req.payload.findByID({
    collection: 'students',
    id: studentId,
    depth: 0,
    select: { status: true },
  })

  if (student.status === 'on-hold') {
    await req.payload.update({
      collection: 'students',
      id: studentId,
      data: { status: 'active' },
    })
  }
}
