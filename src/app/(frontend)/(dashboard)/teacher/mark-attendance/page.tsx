import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Badge } from '@/components/ui/badge'
import { ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@/payload-types'

export default async function MarkAttendanceListPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') redirect('/login')
  const user = authUser as User
  const roles = (user.roles as string[]) ?? []

  if (!roles.includes('teacher') && !roles.includes('superadmin') && !roles.includes('admin')) {
    redirect('/dashboard')
  }

  // Find teacher record
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
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Teacher profile not found.</p>
        </div>
      </div>
    )
  }

  // Get teacher's assigned batches
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

  // Fetch recent attendance sessions for those batches
  const attendanceResult = batchIds.length > 0
    ? await payload.find({
        collection: 'attendance',
        where: {
          or: [
            { teacher: { equals: teacher.id } },
            { batches: { in: batchIds } },
          ],
        },
        depth: 1,
        limit: 20,
        sort: '-date',
      })
    : { docs: [] }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Select a session to mark attendance</p>
      </div>

      {attendanceResult.docs.length === 0 ? (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">No attendance sessions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attendanceResult.docs.map((att) => {
            const attBatches = Array.isArray(att.batches) ? att.batches : []
            const batchNames = attBatches
              .map((b) => typeof b === 'object' && b !== null ? b.courseTitle || b.slug : '')
              .filter(Boolean)
              .join(', ')

            return (
              <Link
                key={att.id}
                href={`/teacher/mark-attendance/${att.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <ClipboardCheck size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {att.type === 'CLASS' ? 'Class' : att.type}
                      {batchNames && ` — ${batchNames}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {att.date && new Date(att.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {att.medium && ` | ${att.medium}`}
                    </p>
                  </div>
                </div>
                <Badge variant={att.visible ? 'default' : 'secondary'} className="text-xs">
                  {att.visible ? 'Active' : 'Expired'}
                </Badge>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
