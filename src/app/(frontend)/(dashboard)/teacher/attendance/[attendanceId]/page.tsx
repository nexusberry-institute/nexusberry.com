import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@/payload-types'
import { MarkAttendanceForm } from './MarkAttendanceForm'

export default async function MarkAttendancePage({
  params,
}: {
  params: Promise<{ attendanceId: string }>
}) {
  const { attendanceId } = await params
  const id = Number(attendanceId)

  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') redirect('/login')
  const user = authUser as User
  const roles = (user.roles as string[]) ?? []

  if (!roles.includes('teacher') && !roles.includes('superadmin') && !roles.includes('admin')) {
    redirect('/dashboard')
  }

  // Find teacher record (for teacher role users)
  let teacherId: number | null = null
  if (roles.includes('teacher')) {
    const teacherResult = await payload.find({
      collection: 'teachers',
      where: { user: { equals: user.id } },
      limit: 1,
      depth: 0,
    })
    const teacher = teacherResult.docs[0]
    if (!teacher) {
      return (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Teacher profile not found.</p>
        </div>
      )
    }
    teacherId = teacher.id
  }

  // Fetch attendance record with batch details
  const attendance = await payload.findByID({
    collection: 'attendance',
    id,
    depth: 1,
    overrideAccess: true,
  })

  if (!attendance) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600">Attendance session not found.</p>
      </div>
    )
  }

  // Verify teacher is assigned to one of the batches (for teacher role)
  const attendanceBatches = Array.isArray(attendance.batches) ? attendance.batches : []
  const batchIds = attendanceBatches
    .map((b) => typeof b === 'object' && b !== null ? b.id : b)
    .filter(Boolean) as number[]

  if (teacherId && batchIds.length > 0) {
    const assignedBatches = await payload.find({
      collection: 'batches',
      where: {
        id: { in: batchIds },
        teachers: { contains: teacherId },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (assignedBatches.docs.length === 0) {
      return (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">You are not assigned to this attendance session&apos;s batches.</p>
        </div>
      )
    }
  }

  // Fetch enrolled students in those batches
  const enrollmentsResult = batchIds.length > 0
    ? await payload.find({
        collection: 'enrollments',
        where: {
          batch: { in: batchIds },
          status: { equals: 'active' },
        },
        depth: 1,
        limit: 200,
        pagination: false,
        overrideAccess: true,
      })
    : { docs: [] }

  // Deduplicate students (a student might be enrolled in multiple batches)
  const studentMap = new Map<number, { id: number; fullName: string }>()
  for (const enrollment of enrollmentsResult.docs) {
    const student = typeof enrollment.student === 'object' && enrollment.student !== null
      ? enrollment.student
      : null
    if (student && !studentMap.has(student.id)) {
      studentMap.set(student.id, {
        id: student.id,
        fullName: student.fullName,
      })
    }
  }

  // Fetch existing attendance details for this session
  const existingDetails = await payload.find({
    collection: 'attendance-details',
    where: { attendance: { equals: id } },
    depth: 0,
    limit: 500,
    pagination: false,
    overrideAccess: true,
  })

  const detailsByStudent = new Map<number, { status: string; medium: string | null }>()
  for (const detail of existingDetails.docs) {
    const studentId = typeof detail.student === 'object' && detail.student !== null
      ? detail.student.id
      : detail.student
    if (typeof studentId === 'number') {
      detailsByStudent.set(studentId, {
        status: detail.status ?? 'ABSENT',
        medium: detail.medium ?? null,
      })
    }
  }

  // Build student rows for the form
  const studentRows = Array.from(studentMap.values())
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map(s => {
      const existing = detailsByStudent.get(s.id)
      return {
        studentId: s.id,
        fullName: s.fullName,
        status: (existing?.status ?? 'ABSENT') as 'PRESENT' | 'ABSENT' | 'LEAVE',
        medium: (existing?.medium ?? null) as 'ONLINE' | 'PHYSICAL' | null,
      }
    })

  const batchNames = attendanceBatches
    .map((b) => typeof b === 'object' && b !== null ? b.slug || b.courseTitle : '')
    .filter(Boolean)
    .join(', ')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/teacher/attendance"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <CalendarDays size={14} />
            {attendance.date && new Date(attendance.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {batchNames && (
              <span className="text-gray-400">| {batchNames}</span>
            )}
          </div>
        </div>
      </div>

      <MarkAttendanceForm attendanceId={id} students={studentRows} />
    </div>
  )
}
