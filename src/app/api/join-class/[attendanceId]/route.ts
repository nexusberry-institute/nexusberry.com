import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

const DASHBOARD_URL = '/lms/dashboard'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attendanceId: string }> },
) {
  const { attendanceId } = await params
  const id = Number(attendanceId)
  if (!id || isNaN(id)) {
    return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=invalid`, _request.url))
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { user: authUser } = await payload.auth({ headers: await nextHeaders() })

    if (!authUser || authUser.collection !== 'users') {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(`/api/join-class/${id}`)}`, _request.url))
    }

    const user = authUser as User
    const roles = (user.roles as string[]) ?? []
    if (!roles.includes('student')) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=not-student`, _request.url))
    }

    // Find linked student record
    const studentResult = await payload.find({
      collection: 'students',
      where: { user: { equals: user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const student = studentResult.docs[0]
    if (!student) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=no-student-profile`, _request.url))
    }

    // Fetch attendance record
    const attendance = await payload.findByID({
      collection: 'attendance',
      id,
      depth: 0,
      overrideAccess: true,
    })

    if (!attendance) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=not-found`, _request.url))
    }

    // Check visible + not expired
    if (!attendance.visible || !attendance.expiry || new Date(attendance.expiry) <= new Date()) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=expired`, _request.url))
    }

    // Check enrollment: student must be enrolled in one of the attendance's batches
    // OR be in the attendance's `users` override list
    const attendanceBatchIds = (attendance.batches as (number | { id: number })[])
      ?.map(b => typeof b === 'object' && b !== null ? b.id : b)
      .filter(Boolean) as number[]

    const overrideUserIds = (attendance.users as (number | { id: number })[])
      ?.map(u => typeof u === 'object' && u !== null ? u.id : u)
      .filter(Boolean) as number[] ?? []

    const isOverrideUser = overrideUserIds.includes(user.id)

    let isEnrolled = false
    if (!isOverrideUser && attendanceBatchIds.length > 0) {
      const enrollmentResult = await payload.find({
        collection: 'enrollments',
        where: {
          student: { equals: student.id },
          batch: { in: attendanceBatchIds },
          status: { equals: 'active' },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      isEnrolled = enrollmentResult.docs.length > 0
    }

    if (!isEnrolled && !isOverrideUser) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=not-enrolled`, _request.url))
    }

    // Deduplication: check if AttendanceDetail already exists
    const existing = await payload.find({
      collection: 'attendance-details',
      where: {
        attendance: { equals: id },
        student: { equals: student.id },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      // Create attendance detail record
      await payload.create({
        collection: 'attendance-details',
        data: {
          attendance: id,
          student: student.id,
          medium: 'ONLINE',
          status: 'PRESENT',
          joinedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    }

    // Redirect to Google Meet
    if (!attendance.onlineClassLink) {
      return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=no-class-link`, _request.url))
    }
    return NextResponse.redirect(attendance.onlineClassLink)
  } catch {
    return NextResponse.redirect(new URL(`${DASHBOARD_URL}?error=server-error`, _request.url))
  }
}
