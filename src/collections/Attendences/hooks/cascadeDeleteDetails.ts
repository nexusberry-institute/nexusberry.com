import type { CollectionAfterDeleteHook } from 'payload'

export const cascadeDeleteDetails: CollectionAfterDeleteHook = async ({
  id,
  req: { payload },
}) => {
  const details = await payload.find({
    collection: 'attendance-details',
    where: { attendance: { equals: id } },
    limit: 500,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  await Promise.all(
    details.docs.map((doc) =>
      payload.delete({
        collection: 'attendance-details',
        id: doc.id,
        overrideAccess: true,
      }),
    ),
  )
}
