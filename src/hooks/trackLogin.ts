import type { CollectionAfterLoginHook } from 'payload'

export const trackLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  await req.payload.update({
    collection: 'users',
    id: user.id,
    data: {
      lastLoginAt: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    },
    req,
    overrideAccess: true,
  })
}
