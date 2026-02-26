import type { Permissions, SanitizedPermissions } from 'payload'

import type { User } from '@/payload-types'

export type Login = (args: { email: string; password: string }) => Promise<{
  success: boolean;
  message: string;
  user?: User | null;
  redirectTo?: string;
}>

export type Logout = () => Promise<{
  success: boolean;
  message?: string;
}>

export interface AuthContext {
  permissions?: null | SanitizedPermissions,
  setPermissions: (user: null | SanitizedPermissions) => void,
  login: Login
  logout: Logout
  setUser: (user: null | User) => void
  user?: null | User
}
