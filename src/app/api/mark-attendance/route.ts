import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

interface AttendanceRecord {
  studentId: number
  status: 'PRESENT' | 'ABSENT' | 'LEAVE'
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user: authUser } = await payload.auth({ headers: await nextHeaders() })

    if (!authUser || authUser.collection !== 'users') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = authUser as User
    const roles = (user.roles as string[]) ?? []
    if (!roles.includes('teacher') && !roles.includes('superadmin') && !roles.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { attendanceId, records } = body as { attendanceId: number; records: AttendanceRecord[] }

    if (!attendanceId || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Fetch attendance record
    const attendance = await payload.findByID({
      collection: 'attendance',
      id: attendanceId,
      depth: 0,
      overrideAccess: true,
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance session not found' }, { status: 404 })
    }

    // If user is a teacher (not admin/superadmin), verify they're assigned to the attendance
    if (!roles.includes('superadmin') && !roles.includes('admin')) {
      const teacherResult = await payload.find({
        collection: 'teachers',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const teacher = teacherResult.docs[0]
      if (!teacher) {
        return NextResponse.json({ error: 'Teacher profile not found' }, { status: 403 })
      }

      // Check if teacher is assigned to one of the attendance's batches
      const attendanceBatchIds = (attendance.batches as (number | { id: number })[])
        ?.map(b => typeof b === 'object' && b !== null ? b.id : b)
        .filter(Boolean) as number[]

      const batchesResult = await payload.find({
        collection: 'batches',
        where: {
          id: { in: attendanceBatchIds },
          teachers: { contains: teacher.id },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (batchesResult.docs.length === 0) {
        return NextResponse.json({ error: 'Not authorized for this attendance session' }, { status: 403 })
      }
    }

    let created = 0
    let updated = 0

    for (const record of records) {
      const { studentId, status } = record
      if (!studentId || !['PRESENT', 'ABSENT', 'LEAVE'].includes(status)) continue

      // Check if detail already exists
      const existing = await payload.find({
        collection: 'attendance-details',
        where: {
          attendance: { equals: attendanceId },
          student: { equals: studentId },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'attendance-details',
          id: existing.docs[0]!.id,
          data: { status },
          overrideAccess: true,
        })
        updated++
      } else {
        await payload.create({
          collection: 'attendance-details',
          data: {
            attendance: attendanceId,
            student: studentId,
            medium: 'PHYSICAL',
            status,
          },
          overrideAccess: true,
        })
        created++
      }
    }

    return NextResponse.json({ success: true, created, updated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
