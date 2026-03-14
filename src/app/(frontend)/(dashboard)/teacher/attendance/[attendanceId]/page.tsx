import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@/payload-types'
import { UpdateAttendanceForm } from './UpdateAttendanceForm'

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

  // Round 1: fetch attendance (with batch+teachers) and teacher record in parallel
  const isTeacher = roles.includes('teacher')
  const [attendance, teacherResult] = await Promise.all([
    payload.findByID({
      collection: 'attendance',
      id,
      depth: 1,
      overrideAccess: true,
    }),
    isTeacher
      ? payload.find({
          collection: 'teachers',
          where: { user: { equals: user.id } },
          limit: 1,
          depth: 0,
        })
      : null,
  ])

  if (!attendance) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-600">Attendance session not found.</p>
      </div>
    )
  }

  // Verify teacher authorization via batch.teachers
  if (isTeacher) {
    const teacher = teacherResult?.docs[0]
    if (!teacher) {
      return (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Teacher profile not found.</p>
        </div>
      )
    }

    const batchObj = typeof attendance.batch === 'object' && attendance.batch !== null
      ? attendance.batch
      : null
    const batchTeacherIds = batchObj && Array.isArray(batchObj.teachers)
      ? batchObj.teachers.map((t: number | { id: number }) => typeof t === 'object' && t !== null ? t.id : t)
      : []

    if (!batchTeacherIds.includes(teacher.id)) {
      return (
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">You are not assigned to this attendance session&apos;s batch.</p>
        </div>
      )
    }
  }

  const batchId = typeof attendance.batch === 'object' && attendance.batch !== null
    ? attendance.batch.id
    : attendance.batch

  // Round 2: fetch enrollments and existing details in parallel
  const [enrollmentsResult, existingDetails] = await Promise.all([
    batchId
      ? payload.find({
          collection: 'enrollments',
          where: {
            batch: { equals: batchId },
            status: { equals: 'active' },
          },
          depth: 1,
          limit: 200,
          pagination: false,
          overrideAccess: true,
        })
      : Promise.resolve({ docs: [] }),
    payload.find({
      collection: 'attendance-details',
      where: { attendance: { equals: id } },
      depth: 0,
      limit: 500,
      pagination: false,
      overrideAccess: true,
    }),
  ])

  // Build student map from enrollments
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

  const batchObj = typeof attendance.batch === 'object' && attendance.batch !== null
    ? attendance.batch
    : null
  const batchName = batchObj ? (batchObj.slug || batchObj.courseTitle) : ''

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
          <h1 className="text-2xl font-bold text-gray-900">Update Attendance</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <CalendarDays size={14} />
            {attendance.date && new Date(attendance.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {batchName && (
              <span className="text-gray-400">| {batchName}</span>
            )}
          </div>
        </div>
      </div>

      <UpdateAttendanceForm attendanceId={id} students={studentRows} />
    </div>
  )
}
