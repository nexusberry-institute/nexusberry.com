import type { CollectionAfterChangeHook } from 'payload'

/**
 * When a student is set to `withdrawn`, drop all their `active` enrollments.
 *
 * Only touches `active` enrollments — already graduated/frozen/dropped ones are left as-is.
 */
export const cascadeWithdrawal: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status !== 'withdrawn') return
  // Skip if status didn't actually change
  if (previousDoc && previousDoc.status === 'withdrawn') return

  const activeEnrollments = await req.payload.find({
    collection: 'enrollments',
    where: {
      student: { equals: doc.id },
      status: { equals: 'active' },
    },
    depth: 0,
    limit: 0,
    select: { status: true },
  })

  for (const enrollment of activeEnrollments.docs) {
    await req.payload.update({
      collection: 'enrollments',
      id: enrollment.id,
      data: { status: 'dropped' },
    })
  }
}
