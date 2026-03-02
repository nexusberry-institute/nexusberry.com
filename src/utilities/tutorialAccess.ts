type AccessResult = {
  hasAccess: boolean
  reason: 'public' | 'authenticated' | 'enrolled' | 'denied'
}

/**
 * Check if a user can access a specific tutorial.
 * Enrolled students always have access. Public tutorials are always accessible.
 * If requiresLogin is set, the user must be authenticated.
 */
export function checkTutorialAccess(
  tutorial: { isPublic?: boolean | null; requiresLogin?: boolean | null },
  isAuthenticated: boolean,
  isEnrolled: boolean = false,
): AccessResult {
  // Enrolled students always have access regardless of isPublic/requiresLogin
  if (isEnrolled && isAuthenticated) {
    return { hasAccess: true, reason: 'enrolled' }
  }

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
