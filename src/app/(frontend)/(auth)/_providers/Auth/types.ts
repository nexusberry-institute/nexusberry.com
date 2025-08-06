import type { Permissions, SanitizedPermissions } from 'payload'

import type { User } from '@/payload-types'


export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<{
  success: boolean;
  message: string;
  error?: string;
}>

export type ForgotPassword = (args: { email: string }) => Promise<{
  success: boolean;
  message: string;
  error: string;
}>

export type Create = (args: {
  email: string
  firstName: string
  lastName: string
  password: string
}) => Promise<{
  success: boolean;
  message: string;
  user: User | null;
}>

export type Login = (args: { email: string; password: string }) => Promise<{
  success: boolean;
  message: string;
  user?: User | null;
}>

export type Logout = () => Promise<{
  success: boolean;
  message?: string;
}>

export interface AuthContext {
  create: Create
  permissions?: null | SanitizedPermissions,
  setPermissions: (user: null | SanitizedPermissions) => void,
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: null | User) => void
  user?: null | User
}
