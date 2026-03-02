import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, CalendarDays, ClipboardCheck } from 'lucide-react'
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

export default async function TeacherDashboardPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  const roles = (user.roles as string[]) ?? []
  if (!roles.includes('teacher')) {
    redirect('/dashboard')
  }

  // Find teacher record linked to this user
  const teacherResult = await payload.find({
    collection: 'teachers',
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 0,
  })

  const teacher = teacherResult.docs[0]

  if (!teacher) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Your teacher profile has not been set up yet. Please contact the administration.
          </p>
        </div>
      </div>
    )
  }

  const todayDay = getTodayDay()

  // Fetch assigned batches
  const batchesResult = await payload.find({
    collection: 'batches',
    where: {
      teachers: { contains: teacher.id },
      active: { equals: true },
    },
    depth: 0,
    limit: 50,
    pagination: false,
  })

  const batchIds = batchesResult.docs.map(b => b.id)

  // Fetch today's schedule and recent attendance in parallel
  const [todayScheduleResult, recentAttendanceResult] = await Promise.all([
    batchIds.length > 0
      ? payload.find({
          collection: 'time-table',
          where: {
            batch: { in: batchIds },
            day: { equals: todayDay },
          },
          depth: 1,
          limit: 20,
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: 'attendance',
      where: { teacher: { equals: teacher.id } },
      depth: 1,
      limit: 5,
      sort: '-date',
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {teacher.nick || teacher.fullName || 'Teacher Dashboard'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Batches */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Active Batches
              <span className="ml-2 text-sm font-normal text-gray-400">({batchesResult.docs.length})</span>
            </h2>
          </div>
          {batchesResult.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No active batches assigned.</p>
          ) : (
            <div className="space-y-3">
              {batchesResult.docs.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{batch.courseTitle}</p>
                    <p className="text-xs text-gray-500">
                      {batch.medium}
                      {batch.startDate && ` | ${new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                      {batch.endDate && ` – ${new Date(batch.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {batch.duration}w
                  </Badge>
                </div>
              ))}
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
          {todayScheduleResult.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No classes scheduled today.</p>
          ) : (
            <div className="space-y-3">
              {todayScheduleResult.docs.map((tt) => {
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

        {/* Recent Attendance */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck size={20} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Attendance Sessions</h2>
          </div>
          {recentAttendanceResult.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent attendance sessions.</p>
          ) : (
            <div className="space-y-3">
              {recentAttendanceResult.docs.map((att) => {
                const attBatches = Array.isArray(att.batches) ? att.batches : []
                return (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {att.type === 'CLASS' ? 'Class' : att.type}
                        {' – '}
                        {attBatches.map((b: any) => typeof b === 'object' ? b.courseTitle : b).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {att.date && new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {att.medium && ` | ${att.medium}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/teacher/mark-attendance/${att.id}`}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                      >
                        Mark Attendance
                      </Link>
                      <Badge variant={att.visible ? 'default' : 'secondary'} className="text-xs">
                        {att.visible ? 'Active' : 'Expired'}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
