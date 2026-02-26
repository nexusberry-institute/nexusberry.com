import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BookOpen, CalendarDays, Video, CreditCard } from 'lucide-react'
import type { User } from '@/payload-types'

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

function getTodayDay(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }))
  return DAY_NAMES[now.getDay()]!
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',
  })
}

export default async function StudentDashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  const roles = (user.roles as string[]) ?? []
  if (!roles.includes('student')) {
    redirect('/dashboard')
  }

  // Find student record linked to this user
  const studentResult = await payload.find({
    collection: 'students',
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 0,
  })

  const student = studentResult.docs[0]

  if (!student) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Your student profile has not been set up yet. Please contact the administration to complete your enrollment.
          </p>
        </div>
      </div>
    )
  }

  // Fetch enrollments, timetable, active classes, and fees in parallel
  const todayDay = getTodayDay()

  const [enrollmentsResult, activeClassesResult, feeResult] = await Promise.all([
    payload.find({
      collection: 'enrollments',
      where: {
        student: { equals: student.id },
        status: { equals: 'active' },
      },
      depth: 2,
      limit: 20,
    }),
    payload.find({
      collection: 'attendance',
      where: {
        visible: { equals: true },
        expiry: { greater_than: new Date().toISOString() },
      },
      depth: 1,
      limit: 5,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'fee-receipts',
      where: { student: { equals: student.id } },
      depth: 0,
      limit: 100,
      pagination: false,
    }),
  ])

  // Get batch IDs from active enrollments
  const batchIds = enrollmentsResult.docs
    .map(e => typeof e.batch === 'object' && e.batch !== null ? e.batch.id : e.batch)
    .filter(Boolean)

  // Fetch today's timetable for enrolled batches
  let todaySchedule: any[] = []
  if (batchIds.length > 0) {
    const ttResult = await payload.find({
      collection: 'time-table',
      where: {
        batch: { in: batchIds },
        day: { equals: todayDay },
      },
      depth: 1,
      limit: 20,
    })
    todaySchedule = ttResult.docs
  }

  // Compute fee totals
  const totalPaid = feeResult.docs
    .filter(f => f.status === 'RECEIVED')
    .reduce((sum, f) => sum + (f.amount ?? 0), 0)
  const totalPending = feeResult.docs
    .filter(f => f.status === 'PENDING')
    .reduce((sum, f) => sum + (f.amount ?? 0), 0)

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    withdrawn: 'bg-red-100 text-red-800',
    graduated: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {student.fullName || 'Student Dashboard'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={statusColors[student.status ?? 'active'] ?? 'bg-gray-100 text-gray-800'}>
              {student.status ?? 'active'}
            </Badge>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Enrollments */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Active Enrollments</h2>
          </div>
          {enrollmentsResult.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No active enrollments.</p>
          ) : (
            <div className="space-y-3">
              {enrollmentsResult.docs.map((enrollment) => {
                const batch = typeof enrollment.batch === 'object' ? enrollment.batch : null
                return (
                  <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{batch?.courseTitle ?? 'Course'}</p>
                      <p className="text-xs text-gray-500">
                        {enrollment.mode ?? batch?.medium ?? ''}
                        {batch?.startDate && ` | Started ${new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {enrollment.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Today's Schedule */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h2>
            <span className="text-xs text-gray-400 ml-auto">{todayDay}</span>
          </div>
          {todaySchedule.length === 0 ? (
            <p className="text-sm text-gray-500">No classes scheduled today.</p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((tt) => {
                const batch = typeof tt.batch === 'object' ? tt.batch : null
                return (
                  <div key={tt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{batch?.courseTitle ?? 'Class'}</p>
                      {tt.room && <p className="text-xs text-gray-500">Room: {tt.room}</p>}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatTime(tt.startTime)} – {formatTime(tt.endTime)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Active Class Links */}
        {activeClassesResult.docs.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Video size={20} className="text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Live Classes</h2>
            </div>
            <div className="space-y-3">
              {activeClassesResult.docs.map((cls) => {
                const clsBatches = Array.isArray(cls.batches) ? cls.batches : []
                // Show only if student's batch is included
                const relevant = clsBatches.some((b: any) => {
                  const bId = typeof b === 'object' ? b.id : b
                  return batchIds.includes(bId)
                })
                if (!relevant) return null

                return (
                  <a
                    key={cls.id}
                    href={cls.onlineClassLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {cls.type === 'CLASS' ? 'Live Class' : cls.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(cls.expiry!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Karachi' })}
                      </p>
                    </div>
                    <Badge className="bg-red-600 text-white">Join</Badge>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* Fee Overview */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Fee Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">Rs. {totalPaid.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Paid</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-700">Rs. {totalPending.toLocaleString()}</p>
              <p className="text-xs text-amber-600 mt-1">Pending</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
