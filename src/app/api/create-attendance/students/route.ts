import { NextRequest, NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

export async function GET(request: NextRequest) {
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

    const batchIdsParam = request.nextUrl.searchParams.get('batchIds')
    if (!batchIdsParam) {
      return NextResponse.json({ error: 'batchIds query param required' }, { status: 400 })
    }

    const batchIds = batchIdsParam.split(',').map(Number).filter(id => !isNaN(id) && id > 0)
    if (batchIds.length === 0) {
      return NextResponse.json({ error: 'Invalid batchIds' }, { status: 400 })
    }

    // Fetch active enrollments for those batches
    const enrollmentsResult = await payload.find({
      collection: 'enrollments',
      where: {
        batch: { in: batchIds },
        status: { equals: 'active' },
      },
      depth: 1,
      limit: 500,
      pagination: false,
      overrideAccess: true,
    })

    // Deduplicate students and sort by name
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

    const students = Array.from(studentMap.values())
      .sort((a, b) => a.fullName.localeCompare(b.fullName))

    return NextResponse.json({ students })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
