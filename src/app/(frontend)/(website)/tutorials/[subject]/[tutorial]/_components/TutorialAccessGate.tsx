'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/(frontend)/(auth)/_providers/Auth'

type Props = {
  accessType?: string | null
  tutorialSlug: string
  children: React.ReactNode
}

export default function TutorialAccessGate({ accessType, tutorialSlug, children }: Props) {
  // Public tutorials — render immediately, no API call
  if (!accessType || accessType !== 'protected') {
    return <>{children}</>
  }

  return <ProtectedGate tutorialSlug={tutorialSlug}>{children}</ProtectedGate>
}

function ProtectedGate({
  tutorialSlug,
  children,
}: {
  tutorialSlug: string
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    // Auth still loading (user is undefined)
    if (user === undefined) return

    // Not logged in
    if (user === null) {
      setHasAccess(false)
      return
    }

    // Logged in — check access via API
    let cancelled = false
    fetch(`/api/tutorial-access/${encodeURIComponent(tutorialSlug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Access check failed')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setHasAccess(data.hasAccess === true)
      })
      .catch(() => {
        if (!cancelled) setHasAccess(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, tutorialSlug])

  // Auth loading or access check in progress
  if (user === undefined || (user !== null && hasAccess === null)) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-muted aspect-video flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </section>
    )
  }

  // Access granted
  if (hasAccess) {
    return <>{children}</>
  }

  // Access denied — show enrollment UI
  return (
    <section className="padding-x max-w-3xl mx-auto py-12">
      <div className="bg-card rounded-xl border border-amber-200 shadow-md p-8 text-center space-y-5">
        <div className="flex justify-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-500"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          This Tutorial Requires Enrollment
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          This is a protected tutorial available to enrolled students. Log in to your account or
          explore our courses to gain access.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/course"
            className="rounded-md border border-border px-6 py-3 text-foreground font-medium hover:bg-muted transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
