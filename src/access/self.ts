// RLS
// OWNER: auth user id = id of row being accessed

import type { Access } from 'payload'

export const self: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}