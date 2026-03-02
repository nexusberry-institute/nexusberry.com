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
    const { batchIds, teacherId, staffNotes, date, records } = body as {
      batchIds: number[]
      teacherId: number
      staffNotes?: string
      date?: string
      records: AttendanceRecord[]
    }

    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      return NextResponse.json({ error: 'At least one batch is required' }, { status: 400 })
    }

    if (!teacherId || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Verify the teacher record belongs to this user (unless admin/superadmin)
    if (!roles.includes('superadmin') && !roles.includes('admin')) {
      const teacherResult = await payload.find({
        collection: 'teachers',
        where: { user: { equals: user.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const teacher = teacherResult.docs[0]
      if (!teacher || teacher.id !== teacherId) {
        return NextResponse.json({ error: 'Teacher mismatch' }, { status: 403 })
      }

      // Verify teacher is assigned to all selected batches
      const assignedBatches = await payload.find({
        collection: 'batches',
        where: {
          id: { in: batchIds },
          teachers: { contains: teacherId },
          active: { equals: true },
        },
        depth: 0,
        limit: 50,
        overrideAccess: true,
      })

      if (assignedBatches.docs.length !== batchIds.length) {
        return NextResponse.json({ error: 'Not assigned to all selected batches' }, { status: 403 })
      }
    }

    // Resolve session date — use provided date or default to now
    let sessionDate: string
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const parsed = new Date(`${date}T00:00:00`)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
      }
      sessionDate = parsed.toISOString()
    } else {
      sessionDate = new Date().toISOString()
    }

    // Create the attendance record
    const attendance = await payload.create({
      collection: 'attendance',
      data: {
        batches: batchIds,
        teacher: teacherId,
        date: sessionDate,
        visible: true,
        staffNotes: staffNotes || undefined,
      },
      overrideAccess: true,
    })

    // Create attendance-details for each student
    let detailsCreated = 0
    for (const record of records) {
      const { studentId, status } = record
      if (!studentId || !['PRESENT', 'ABSENT', 'LEAVE'].includes(status)) continue

      await payload.create({
        collection: 'attendance-details',
        data: {
          attendance: attendance.id,
          student: studentId,
          medium: 'ONLINE',
          status,
        },
        overrideAccess: true,
      })
      detailsCreated++
    }

    return NextResponse.json({ attendanceId: attendance.id, detailsCreated })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
