import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { Users, UserPlus, GraduationCap, Monitor } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { PieChartWidget } from '../_components/charts/PieChartWidget'

export default async function StudentsAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  const [
    activeStudents,
    enrollmentsThisMonth,
    enrollmentsLastMonth,
    allEnrollments,
    activeBatches,
    students,
  ] = await Promise.all([
    payload.count({ collection: 'students', where: { status: { equals: 'active' } } }),
    payload.count({ collection: 'enrollments', where: { admissionDate: { greater_than_equal: startOfMonth } } }),
    payload.count({ collection: 'enrollments', where: { admissionDate: { greater_than_equal: startOfLastMonth, less_than: startOfMonth } } }),
    payload.find({
      collection: 'enrollments',
      where: { admissionDate: { greater_than_equal: twelveMonthsAgo } },
      limit: 5000,
      depth: 1,
      select: { status: true, mode: true, admissionDate: true, batch: true },
      pagination: false,
    }),
    payload.find({
      collection: 'batches',
      where: { active: { equals: true } },
      limit: 100,
      depth: 0,
      select: { courseTitle: true, medium: true, startDate: true, endDate: true, slug: true },
      pagination: false,
    }),
    payload.find({
      collection: 'students',
      limit: 5000,
      depth: 0,
      select: { education: true, address: true, status: true },
      pagination: false,
    }),
  ])

  // KPIs
  const enrollmentTrend = enrollmentsLastMonth.totalDocs > 0
    ? ((enrollmentsThisMonth.totalDocs - enrollmentsLastMonth.totalDocs) / enrollmentsLastMonth.totalDocs) * 100
    : 0

  const graduated = allEnrollments.docs.filter((e) => e.status === 'graduated').length
  const total = allEnrollments.docs.length
  const graduationRate = total > 0 ? (graduated / total) * 100 : 0

  const modeCounts = { ONLINE: 0, PHYSICAL: 0, HYBRID: 0 }
  allEnrollments.docs.forEach((e) => {
    const mode = (e.mode as string) || 'PHYSICAL'
    if (mode in modeCounts) modeCounts[mode as keyof typeof modeCounts]++
  })
  const modeSplit = `${modeCounts.ONLINE}/${modeCounts.PHYSICAL}/${modeCounts.HYBRID}`

  // Monthly enrollments (stacked by mode)
  const monthlyEnrollments: Record<string, { ONLINE: number; PHYSICAL: number; HYBRID: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthlyEnrollments[d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })] = { ONLINE: 0, PHYSICAL: 0, HYBRID: 0 }
  }
  allEnrollments.docs.forEach((e) => {
    if (!e.admissionDate) return
    const d = new Date(e.admissionDate)
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const mode = (e.mode as string) || 'PHYSICAL'
    if (monthlyEnrollments[key] && mode in monthlyEnrollments[key]!) {
      monthlyEnrollments[key]![mode as keyof typeof modeCounts]++
    }
  })
  const monthlyEnrollmentData = Object.entries(monthlyEnrollments).map(([month, modes]) => ({ month, ...modes }))

  // Enrollment status distribution
  const statusCounts: Record<string, number> = {}
  allEnrollments.docs.forEach((e) => {
    const s = (e.status as string) || 'active'
    statusCounts[s] = (statusCounts[s] || 0) + 1
  })
  const statusColors: Record<string, string> = { active: '#10b981', graduated: '#2563eb', frozen: '#94a3b8', dropped: '#ef4444', 'refund-requested': '#f59e0b' }
  const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: statusColors[name] || '#6b7280',
  }))

  // Enrollments per batch (top 15 active)
  const batchEnrollmentCounts: Record<string, number> = {}
  allEnrollments.docs.forEach((e) => {
    const batchId = typeof e.batch === 'object' && e.batch ? e.batch.id : e.batch
    if (batchId) batchEnrollmentCounts[String(batchId)] = (batchEnrollmentCounts[String(batchId)] || 0) + 1
  })
  const batchData = activeBatches.docs
    .map((b) => ({
      batch: b.courseTitle || b.slug || 'Unknown',
      enrolled: batchEnrollmentCounts[String(b.id)] || 0,
    }))
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 15)

  // City distribution (top 10)
  const cityCounts: Record<string, number> = {}
  students.docs.forEach((s) => {
    const city = (s.address as any)?.city || 'Unknown'
    cityCounts[city] = (cityCounts[city] || 0) + 1
  })
  const cityData = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }))

  // Education distribution
  const educationCounts: Record<string, number> = {}
  students.docs.forEach((s) => {
    const edu = (s.education as string) || 'Unknown'
    educationCounts[edu] = (educationCounts[edu] || 0) + 1
  })
  const educationData = Object.entries(educationCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([education, count]) => ({ education, count }))

  // Batch health table
  const batchHealth = activeBatches.docs.map((b) => {
    const enrolledCount = batchEnrollmentCounts[String(b.id)] || 0
    const batchEnrollments = allEnrollments.docs.filter((e) => {
      const batchId = typeof e.batch === 'object' && e.batch ? e.batch.id : e.batch
      return String(batchId) === String(b.id)
    })
    const graduatedCount = batchEnrollments.filter((e) => e.status === 'graduated').length
    const completionPct = enrolledCount > 0 ? (graduatedCount / enrolledCount) * 100 : 0
    return {
      courseTitle: b.courseTitle || 'Unknown',
      enrolled: enrolledCount,
      medium: b.medium || 'N/A',
      startDate: b.startDate ? new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-',
      endDate: b.endDate ? new Date(b.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-',
      completion: `${completionPct.toFixed(0)}%`,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students & Enrollment</h1>
        <p className="text-sm text-gray-500 mt-1">Enrollment trends, retention, and demographics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Students" value={activeStudents.totalDocs} icon={<Users size={20} />} />
        <KpiCard label="New Enrollments (Month)" value={enrollmentsThisMonth.totalDocs} icon={<UserPlus size={20} />} trend={enrollmentTrend} />
        <KpiCard label="Graduation Rate" value={`${graduationRate.toFixed(1)}%`} icon={<GraduationCap size={20} />} />
        <KpiCard label="Online/Physical/Hybrid" value={modeSplit} icon={<Monitor size={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Enrollments" description="By mode, last 12 months" className="lg:col-span-2">
          <BarChartWidget
            data={monthlyEnrollmentData}
            xKey="month"
            bars={[
              { dataKey: 'ONLINE', color: '#2563eb', name: 'Online' },
              { dataKey: 'PHYSICAL', color: '#10b981', name: 'Physical' },
              { dataKey: 'HYBRID', color: '#f59e0b', name: 'Hybrid' },
            ]}
            stacked
          />
        </ChartCard>

        <ChartCard title="Enrollment Status Distribution">
          <PieChartWidget data={statusDistribution} />
        </ChartCard>

        <ChartCard title="Enrollments Per Batch" description="Top 15 active batches">
          <BarChartWidget
            data={batchData}
            xKey="batch"
            bars={[{ dataKey: 'enrolled', color: '#2563eb', name: 'Enrolled' }]}
            layout="vertical"
            height={400}
          />
        </ChartCard>

        <ChartCard title="City Distribution" description="Top 10 cities">
          <BarChartWidget
            data={cityData}
            xKey="city"
            bars={[{ dataKey: 'count', color: '#8b5cf6', name: 'Students' }]}
          />
        </ChartCard>

        <ChartCard title="Education Level Distribution">
          <BarChartWidget
            data={educationData}
            xKey="education"
            bars={[{ dataKey: 'count', color: '#f59e0b', name: 'Students' }]}
          />
        </ChartCard>
      </div>

      {/* Batch Health Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Batch Health</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Course</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Enrolled</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Medium</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Start</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">End</th>
                <th className="px-6 py-3 text-center font-medium text-gray-500">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batchHealth.map((b, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{b.courseTitle}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{b.enrolled}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{b.medium}</td>
                  <td className="px-6 py-3 text-center text-gray-500">{b.startDate}</td>
                  <td className="px-6 py-3 text-center text-gray-500">{b.endDate}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{b.completion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
