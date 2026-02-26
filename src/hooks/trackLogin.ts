import type { CollectionAfterLoginHook } from 'payload'
import { randomBytes } from 'node:crypto'

export const trackLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  const sessionToken = randomBytes(32).toString('hex')

  await req.payload.update({
    collection: 'users',
    id: user.id,
    data: {
      lastLoginAt: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
      sessionToken,
    },
    req,
    overrideAccess: true,
  })
}
