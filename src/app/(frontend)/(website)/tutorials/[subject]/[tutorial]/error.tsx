'use client'

import Link from 'next/link'

export default function TutorialError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground">
          We encountered an error loading this tutorial. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/tutorials"
            className="rounded-md border border-border px-6 py-3 text-foreground font-medium hover:bg-muted transition-colors"
          >
            Browse Tutorials
          </Link>
        </div>
      </div>
    </div>
  )
}
