import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@/payload-types'
import { CreateAttendanceForm } from './CreateAttendanceForm'

export default async function CreateAttendancePage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Create Attendance</h1>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Teacher profile not found.</p>
        </div>
      </div>
    )
  }

  // Fetch active batches assigned to this teacher
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

  const batches = batchesResult.docs.map(b => ({
    id: b.id,
    courseTitle: b.courseTitle,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/teacher/dashboard"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Attendance Session</h1>
          <p className="mt-1 text-sm text-gray-500">Select batches and mark attendance for enrolled students</p>
        </div>
      </div>

      <CreateAttendanceForm teacherId={teacher.id} batches={batches} />
    </div>
  )
}
