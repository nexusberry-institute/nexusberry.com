import type { User, PayloadMcpApiKey } from '@/payload-types'

// User type that may come from MCP API key auth or regular user auth
type AuthUser =
  | (User & { collection: 'users' })
  | (PayloadMcpApiKey & { collection: 'payload-mcp-api-keys' })
  | null
  | undefined

export const checkRole = (allRoles: User['roles'] = [], user: AuthUser): boolean => {
  // Check if user exists and has roles property (excludes MCP API keys which don't have roles)
  if (user && 'roles' in user && Array.isArray(user.roles)) {
    if (
      allRoles?.some((role) => {
        return user.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      {return true}
  }

  return false
}
