type AccessResult = {
  hasAccess: boolean
  reason: 'public' | 'authenticated' | 'denied'
}

/**
 * Check if a user can access a specific tutorial.
 * Public tutorials are always accessible. If requiresLogin is set,
 * the user must be authenticated.
 */
export function checkTutorialAccess(
  tutorial: { isPublic?: boolean | null; requiresLogin?: boolean | null },
  isAuthenticated: boolean,
): AccessResult {
  if (!tutorial.isPublic) {
    return { hasAccess: false, reason: 'denied' }
  }

  if (tutorial.requiresLogin && !isAuthenticated) {
    return { hasAccess: false, reason: 'denied' }
  }

  if (tutorial.requiresLogin && isAuthenticated) {
    return { hasAccess: true, reason: 'authenticated' }
  }

  return { hasAccess: true, reason: 'public' }
}
