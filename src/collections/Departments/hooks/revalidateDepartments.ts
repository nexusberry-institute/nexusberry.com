import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'


export const revalidateDepartments: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {

    payload.logger.info(`Revalidating courses page`)

    // revalidatePath(path)
    revalidateTag('departments')
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {

    // revalidatePath(path)
    revalidateTag('departments')
  }

  return doc
}
