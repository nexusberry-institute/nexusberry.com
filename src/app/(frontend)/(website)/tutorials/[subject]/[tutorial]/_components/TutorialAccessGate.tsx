'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/(frontend)/_providers/Auth'

type Props = {
  requiresLogin?: boolean | null
  children: React.ReactNode
}

export default function TutorialAccessGate({ requiresLogin, children }: Props) {
  const { user } = useAuth()
  const pathname = usePathname()

  // No login required — render immediately
  if (!requiresLogin) {
    return <>{children}</>
  }

  // Auth still loading
  if (user === undefined) {
    return (
      <section className="padding-x max-w-5xl mx-auto py-10 md:py-14">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-border bg-muted aspect-video flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </section>
    )
  }

  // Logged in — grant access
  if (user) {
    return <>{children}</>
  }

  // Not logged in — show login prompt
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
          Login Required
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Please log in to access the videos and content for this tutorial. The description above is always available.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/tutorials"
            className="rounded-md border border-border px-6 py-3 text-foreground font-medium hover:bg-muted transition-colors"
          >
            Browse Tutorials
          </Link>
        </div>
      </div>
    </section>
  )
}
