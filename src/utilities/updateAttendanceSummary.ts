import type { Payload } from 'payload'

export async function updateAttendanceSummary(payload: Payload, attendanceId: number) {
  // Fetch the attendance record to get the batch ID
  const attendance = await payload.findByID({
    collection: 'attendance',
    id: attendanceId,
    depth: 0,
    overrideAccess: true,
  })

  const batchId =
    typeof attendance.batch === 'object' && attendance.batch !== null
      ? attendance.batch.id
      : attendance.batch

  // Fetch existing detail records and active enrollments in parallel
  const [details, enrollments] = await Promise.all([
    payload.find({
      collection: 'attendance-details',
      where: { attendance: { equals: attendanceId } },
      limit: 500,
      pagination: false,
      depth: 0,
      overrideAccess: true,
    }),
    batchId
      ? payload.find({
          collection: 'enrollments',
          where: {
            batch: { equals: batchId },
            status: { equals: 'active' },
          },
          limit: 500,
          pagination: false,
          depth: 0,
          overrideAccess: true,
        })
      : Promise.resolve({ docs: [] }),
  ])

  let p = 0,
    a = 0,
    l = 0
  for (const d of details.docs) {
    if (d.status === 'PRESENT') p++
    else if (d.status === 'ABSENT') a++
    else if (d.status === 'LEAVE') l++
  }

  // Count enrolled students without an attendance-detail record as ABSENT
  const studentsWithRecords = new Set(
    details.docs.map((d) =>
      typeof d.student === 'object' && d.student !== null ? d.student.id : d.student,
    ),
  )
  for (const enrollment of enrollments.docs) {
    const studentId =
      typeof enrollment.student === 'object' && enrollment.student !== null
        ? enrollment.student.id
        : enrollment.student
    if (typeof studentId === 'number' && !studentsWithRecords.has(studentId)) {
      a++ // unrecorded = absent
    }
  }

  await payload.update({
    collection: 'attendance',
    id: attendanceId,
    data: { summary: `P:${p}|A:${a}|L:${l}` },
    overrideAccess: true,
  })
}
