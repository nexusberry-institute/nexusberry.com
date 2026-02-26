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
    // Only set user if it's a regular user (not MCP API key)
    const regularUser = user && user.collection === 'users' ? user : null
    setUser(regularUser)
    setPermissions(permissions)
  }, [user, permissions, setUser, setPermissions])

  return null
}
