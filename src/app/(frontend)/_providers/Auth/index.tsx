'use client'

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react'

import type { AuthContext, Login, Logout } from './types'

import { getUser, payloadLogin, payloadLogout } from './payloadFunctions'

import { User } from '@/payload-types'
import { SanitizedPermissions } from 'payload'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [user, setUser] = useState<null | User>()
  const [permissions, setPermissions] = useState<null | SanitizedPermissions>()

  useEffect(() => {
    const fetchMe = async () => {
      const { user, permissions } = await getUser()
      // Only set user if it's a regular user (not MCP API key)
      const regularUser = user && user.collection === 'users' ? user : null
      setUser(regularUser)
      setPermissions(permissions)
    }
    void fetchMe()
  }, [])

  const login = useCallback<Login>(
    async (args) => {
      const result = await payloadLogin({ email: args.email, password: args.password })
      setUser(result.user)
      return {
        success: result.success,
        message: result.message,
        user: result.user,
        redirectTo: result.redirectTo,
      }
    },
    [],
  )

  const logout = useCallback<Logout>(
    async () => {
      const result = await payloadLogout()
      if (result.success) {
        setUser(null)
      }
      return result
    }, [])

  return (
    <Context.Provider
      value={{
        user,
        permissions,
        setPermissions,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth = () => AuthContext

export const useAuth: UseAuth = () => useContext(Context)
