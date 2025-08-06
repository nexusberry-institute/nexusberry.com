import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const admins: Access = ({ req: { user } }) => checkRole(
  ['superadmin', 'admin', 'developer']
  , user)
