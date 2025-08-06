'use client'

import type { PayloadRequest, Permissions } from 'payload'


import { useEffect } from 'react'

import { useAuth } from '../../_providers/Auth'

export const HydrateClientUser: React.FC<{
  permissions: Permissions | any
  user: PayloadRequest['user']
}> = ({ permissions, user }) => {
  const { setPermissions, setUser } = useAuth()

  useEffect(() => {
    setUser(user)
    setPermissions(permissions)
  }, [user, permissions, setUser, setPermissions])

  return null
}
