import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { CalendarCheck, Percent, Monitor, CalendarDays } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { LineChartWidget } from '../_components/charts/LineChartWidget'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { AreaChartWidget } from '../_components/charts/AreaChartWidget'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default async function AttendanceAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const today = now.toISOString().split('T')[0]!
  const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

  const [
    attendanceThisMonth,
    allAttendanceSessions,
    attendanceDetails,
    activeBatches,
    recentByTeacher,
  ] = await Promise.all([
    payload.count({ collection: 'attendance', where: { date: { greater_than_equal: startOfMonth } } }),
    payload.find({
      collection: 'attendance',
      where: { date: { greater_than_equal: sixMonthsAgo } },
      limit: 5000,
      depth: 1,
      select: { date: true, batches: true, teacher: true },
      pagination: false,
    }),
    payload.find({
      collection: 'attendance-details',
      where: { createdAt: { greater_than_equal: twelveWeeksAgo } },
      limit: 10000,
      depth: 0,
      select: { status: true, medium: true, createdAt: true, attendance: true },
      pagination: false,
    }),
    payload.find({
      collection: 'batches',
      where: { active: { equals: true } },
      limit: 100,
      depth: 0,
      select: { courseTitle: true, slug: true },
      pagination: false,
    }),
    payload.find({
      collection: 'attendance',
      where: { date: { greater_than_equal: thirtyDaysAgo } },
      limit: 5000,
      depth: 1,
      select: { teacher: true },
      pagination: false,
    }),
  ])

  // KPIs
  const totalPresent = attendanceDetails.docs.filter((d) => d.status === 'PRESENT').length
  const totalDetails = attendanceDetails.docs.length
  const avgAttendanceRate = totalDetails > 0 ? (totalPresent / totalDetails) * 100 : 0

  const onlineDetails = attendanceDetails.docs.filter((d) => d.medium === 'ONLINE').length
  const physicalDetails = attendanceDetails.docs.filter((d) => d.medium === 'PHYSICAL').length

  const todaySessions = allAttendanceSessions.docs.filter(
    (s) => s.date && s.date.startsWith(today),
  ).length

  // Weekly attendance rate trend (12 weeks)
  const weeklyRates: { week: string; rate: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 86400000)
    const weekEnd = new Date(now.getTime() - i * 7 * 86400000)
    const weekDetails = attendanceDetails.docs.filter((d) => {
      if (!d.createdAt) return false
      const dt = new Date(d.createdAt)
      return dt >= weekStart && dt < weekEnd
    })
    const present = weekDetails.filter((d) => d.status === 'PRESENT').length
    const rate = weekDetails.length > 0 ? (present / weekDetails.length) * 100 : 0
    weeklyRates.push({
      week: `W${12 - i}`,
      rate: Math.round(rate * 10) / 10,
    })
  }

  // Attendance rate by batch
  const batchAttendance: Record<string, { present: number; total: number }> = {}
  // Map attendance sessions to batch IDs
  const sessionToBatches: Record<string, string[]> = {}
  allAttendanceSessions.docs.forEach((s) => {
    const batches = Array.isArray(s.batches)
      ? s.batches.map((b: any) => (typeof b === 'object' ? String(b.id) : String(b)))
      : []
    sessionToBatches[String(s.id)] = batches
  })

  attendanceDetails.docs.forEach((d) => {
    const sessionId = typeof d.attendance === 'object' && d.attendance ? String(d.attendance.id || d.attendance) : String(d.attendance)
    const batchIds = sessionToBatches[sessionId] || []
    batchIds.forEach((batchId) => {
      if (!batchAttendance[batchId]) batchAttendance[batchId] = { present: 0, total: 0 }
      batchAttendance[batchId]!.total++
      if (d.status === 'PRESENT') batchAttendance[batchId]!.present++
    })
  })

  const batchRateData = activeBatches.docs
    .map((b) => {
      const stats = batchAttendance[String(b.id)]
      const rate = stats && stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
      return { batch: b.courseTitle || b.slug || 'Unknown', rate }
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 15)

  // Online vs Physical monthly trend
  const monthlyMedium: { month: string; online: number; physical: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = d.getTime()
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime()
    const monthDetails = attendanceDetails.docs.filter((det) => {
      if (!det.createdAt) return false
      const dt = new Date(det.createdAt).getTime()
      return dt >= monthStart && dt <= monthEnd
    })
    monthlyMedium.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      online: monthDetails.filter((det) => det.medium === 'ONLINE').length,
      physical: monthDetails.filter((det) => det.medium === 'PHYSICAL').length,
    })
  }

  // Day-of-week heatmap
  const dayOfWeekData = DAY_NAMES.map((day, dayIndex) => {
    const sessions = allAttendanceSessions.docs.filter((s) => {
      if (!s.date) return false
      return new Date(s.date).getDay() === dayIndex
    })
    return { day, classes: sessions.length }
  })

  // Teacher activity (last 30 days)
  const teacherClasses: Record<string, { name: string; count: number }> = {}
  recentByTeacher.docs.forEach((s) => {
    const teacher = typeof s.teacher === 'object' && s.teacher ? s.teacher : null
    if (!teacher) return
    const id = String((teacher as any).id)
    if (!teacherClasses[id]) {
      teacherClasses[id] = { name: (teacher as any).nick || (teacher as any).fullName || 'Unknown', count: 0 }
    }
    teacherClasses[id]!.count++
  })
  const teacherActivityData = Object.values(teacherClasses)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((t) => ({ teacher: t.name, classes: t.count }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Class delivery monitoring and engagement patterns</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Classes This Month" value={attendanceThisMonth.totalDocs} icon={<CalendarCheck size={20} />} />
        <KpiCard label="Avg Attendance Rate" value={`${avgAttendanceRate.toFixed(1)}%`} icon={<Percent size={20} />} />
        <KpiCard label="Online / Physical" value={`${onlineDetails} / ${physicalDetails}`} icon={<Monitor size={20} />} />
        <KpiCard label="Classes Today" value={todaySessions} icon={<CalendarDays size={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Attendance Rate" description="Last 12 weeks" className="lg:col-span-2">
          <LineChartWidget
            data={weeklyRates}
            xKey="week"
            lines={[{ dataKey: 'rate', color: '#10b981', name: 'Attendance %' }]}
          />
        </ChartCard>

        <ChartCard title="Attendance Rate by Batch" description="Active batches, ranked">
          <BarChartWidget
            data={batchRateData}
            xKey="batch"
            bars={[{ dataKey: 'rate', color: '#2563eb', name: 'Rate %' }]}
            layout="vertical"
            height={400}
          />
        </ChartCard>

        <ChartCard title="Online vs Physical Trend" description="Monthly, last 6 months">
          <AreaChartWidget data={monthlyMedium} xKey="month" yKey="online" color="#2563eb" />
        </ChartCard>

        <ChartCard title="Classes by Day of Week">
          <BarChartWidget
            data={dayOfWeekData}
            xKey="day"
            bars={[{ dataKey: 'classes', color: '#8b5cf6', name: 'Classes' }]}
          />
        </ChartCard>

        <ChartCard title="Teacher Activity" description="Classes per teacher, last 30 days">
          <BarChartWidget
            data={teacherActivityData}
            xKey="teacher"
            bars={[{ dataKey: 'classes', color: '#f59e0b', name: 'Classes' }]}
            layout="vertical"
            height={350}
          />
        </ChartCard>
      </div>
    </div>
  )
}
