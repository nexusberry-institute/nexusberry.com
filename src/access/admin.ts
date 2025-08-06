import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const admin: Access = ({ req: { user } }) => checkRole(
  ['superadmin', 'admin']
  , user)