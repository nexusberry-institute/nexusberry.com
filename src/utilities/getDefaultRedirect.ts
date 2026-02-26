/**
 * Maps user roles to their default dashboard path.
 * Priority is implicit in array order — first match wins.
 */
const ROLE_PATHS: [string, string][] = [
  ['superadmin', '/admin'],
  ['admin', '/admin'],
  ['developer', '/admin'],
  ['operations', '/admin'],
  ['accountant', '/admin'],
  ['csr', '/admin'],
  ['teacher', '/teacher/dashboard'],
  ['student', '/lms/dashboard'],
]

export function getDefaultRedirect(roles?: string[]): string {
  if (!roles?.length) return '/dashboard'
  const match = ROLE_PATHS.find(([role]) => roles.includes(role))
  return match ? match[1] : '/dashboard'
}
