import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BlockedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Account Temporarily Blocked</h1>
          <p className="text-gray-600">
            Your account has been temporarily blocked. Please contact NexusBerry staff for
            assistance.
          </p>
        </div>

        <Link href="/logout">
          <Button variant="outline" className="mt-4">
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
