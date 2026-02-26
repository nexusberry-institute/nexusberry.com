import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { BookOpen, Users, Settings } from 'lucide-react'
import type { User } from '@/payload-types'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User

  const roles = (user.roles as string[]) ?? []
  const name = user.gmail_username || user.email?.split('@')[0] || 'there'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {name}</h1>
        <p className="mt-1 text-gray-500">Here&apos;s your dashboard overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.includes('student') && (
          <Link
            href="/lms/dashboard"
            className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Student Dashboard</p>
              <p className="text-sm text-gray-500">View courses, schedule & fees</p>
            </div>
          </Link>
        )}

        {roles.includes('teacher') && (
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-50 text-green-600">
              <Users size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Teacher Dashboard</p>
              <p className="text-sm text-gray-500">View batches & attendance</p>
            </div>
          </Link>
        )}

        <Link
          href="/account"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-600">
            <Settings size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Account Settings</p>
            <p className="text-sm text-gray-500">Update your profile</p>
          </div>
        </Link>
      </div>

      {!roles.includes('student') && !roles.includes('teacher') && (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Browse our{' '}
            <Link href="/departments" className="text-blue-600 hover:underline">
              courses
            </Link>{' '}
            to get started, or check out upcoming{' '}
            <Link href="/events" className="text-blue-600 hover:underline">
              events
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
