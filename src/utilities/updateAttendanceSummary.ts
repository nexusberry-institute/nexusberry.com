import type { Payload } from 'payload'

export async function updateAttendanceSummary(payload: Payload, attendanceId: number) {
  const details = await payload.find({
    collection: 'attendance-details',
    where: { attendance: { equals: attendanceId } },
    limit: 500,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  let p = 0,
    a = 0,
    l = 0
  for (const d of details.docs) {
    if (d.status === 'PRESENT') p++
    else if (d.status === 'ABSENT') a++
    else if (d.status === 'LEAVE') l++
  }

  await payload.update({
    collection: 'attendance',
    id: attendanceId,
    data: { summary: `P:${p}|A:${a}|L:${l}` },
    overrideAccess: true,
  })
}
