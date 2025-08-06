import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const superAdmin: Access = ({ req: { user } }) => checkRole(
  ['superadmin']
  , user)
