import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { Target, Percent, Clock, XCircle, Users } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { PieChartWidget } from '../_components/charts/PieChartWidget'
import { FunnelChart } from '../_components/charts/FunnelChart'

export default async function LeadsAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  const [leadsThisMonth, allLeads, staffs] = await Promise.all([
    payload.count({ collection: 'leads', where: { createdAt: { greater_than_equal: startOfMonth } } }),
    payload.find({
      collection: 'leads',
      where: { createdAt: { greater_than_equal: twelveMonthsAgo } },
      limit: 10000,
      depth: 1,
      select: { stage: true, lostReason: true, source: true, assign_to: true, course: true, createdAt: true, confirmedAttending: true, actuallyAttended: true },
      pagination: false,
    }),
    payload.find({
      collection: 'staffs',
      limit: 100,
      depth: 0,
      select: { fullName: true, nick: true },
      pagination: false,
    }),
  ])

  const leads = allLeads.docs

  // KPIs
  const enrolledAll = leads.filter((l) => l.stage === 'ENROLLED').length
  const lostAll = leads.filter((l) => l.stage === 'LOST').length
  const conversionRate = leads.length > 0 ? (enrolledAll / leads.length) * 100 : 0
  const lostRate = leads.length > 0 ? (lostAll / leads.length) * 100 : 0

  // Trial attendance rate
  const confirmedTrials = leads.filter((l) => l.confirmedAttending).length
  const actuallyAttended = leads.filter((l) => l.actuallyAttended).length
  const trialAttendanceRate = confirmedTrials > 0 ? (actuallyAttended / confirmedTrials) * 100 : 0

  // Lead funnel
  const stageCounts: Record<string, number> = { NEW: 0, QUALIFIED: 0, NOT_QUALIFIED: 0, NEGOTIATION: 0, ENROLLED: 0, LOST: 0 }
  leads.forEach((l) => {
    const stage = l.stage as string
    if (stage in stageCounts) stageCounts[stage]!++
  })

  const funnelStages = [
    { label: 'New', value: stageCounts.NEW!, color: '#94a3b8' },
    { label: 'Qualified', value: stageCounts.QUALIFIED!, color: '#60a5fa' },
    { label: 'Negotiation', value: stageCounts.NEGOTIATION!, color: '#f59e0b' },
    { label: 'Enrolled', value: stageCounts.ENROLLED!, color: '#10b981' },
  ]

  // Monthly lead volume (stacked by stage)
  const monthlyLeads: { month: string; NEW: number; QUALIFIED: number; NEGOTIATION: number; ENROLLED: number; LOST: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = d.getTime()
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime()
    const monthLeads = leads.filter((l) => {
      if (!l.createdAt) return false
      const t = new Date(l.createdAt).getTime()
      return t >= monthStart && t <= monthEnd
    })
    const counts = { NEW: 0, QUALIFIED: 0, NEGOTIATION: 0, ENROLLED: 0, LOST: 0 }
    monthLeads.forEach((l) => {
      const stage = l.stage as keyof typeof counts
      if (stage in counts) counts[stage]++
    })
    monthlyLeads.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      ...counts,
    })
  }

  // Lead source breakdown
  const sourceCounts: Record<string, number> = {}
  leads.forEach((l) => {
    const source = (l.source as string) || 'Unknown'
    sourceCounts[source] = (sourceCounts[source] || 0) + 1
  })
  const sourceColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6']
  const sourceDistribution = Object.entries(sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value], i) => ({ name, value, color: sourceColors[i % sourceColors.length]! }))

  // Lost reason analysis
  const lostReasons: Record<string, number> = {}
  leads.filter((l) => l.stage === 'LOST').forEach((l) => {
    const reason = (l.lostReason as string) || 'Unknown'
    lostReasons[reason] = (lostReasons[reason] || 0) + 1
  })
  const lostReasonData = Object.entries(lostReasons)
    .sort(([, a], [, b]) => b - a)
    .map(([reason, count]) => ({ reason, count }))

  // CSR performance
  const staffMap = new Map(staffs.docs.map((s) => [String(s.id), s.nick || s.fullName || 'Unknown']))
  const csrLeads: Record<string, { total: number; enrolled: number }> = {}
  leads.forEach((l) => {
    const assignedId = typeof l.assign_to === 'object' && l.assign_to ? String((l.assign_to as any).id) : l.assign_to ? String(l.assign_to) : null
    if (!assignedId) return
    if (!csrLeads[assignedId]) csrLeads[assignedId] = { total: 0, enrolled: 0 }
    csrLeads[assignedId]!.total++
    if (l.stage === 'ENROLLED') csrLeads[assignedId]!.enrolled++
  })
  const csrData = Object.entries(csrLeads)
    .map(([id, data]) => ({
      csr: staffMap.get(id) || `Staff #${id}`,
      leads: data.total,
      conversions: data.enrolled,
    }))
    .sort((a, b) => b.leads - a.leads)

  // Course interest
  const courseCounts: Record<string, number> = {}
  leads.forEach((l) => {
    const course = typeof l.course === 'object' && l.course ? (l.course as any).title || 'Unknown' : l.course ? String(l.course) : 'Unknown'
    courseCounts[course] = (courseCounts[course] || 0) + 1
  })
  const courseInterestData = Object.entries(courseCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([course, count]) => ({ course, count }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">Sales funnel, source effectiveness, and CSR performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Leads This Month" value={leadsThisMonth.totalDocs} icon={<Target size={20} />} />
        <KpiCard label="All-Time Leads (12mo)" value={leads.length} icon={<Users size={20} />} />
        <KpiCard label="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} icon={<Percent size={20} />} />
        <KpiCard label="Lost Rate" value={`${lostRate.toFixed(1)}%`} icon={<XCircle size={20} />} />
        <KpiCard label="Trial Attendance" value={`${trialAttendanceRate.toFixed(1)}%`} icon={<Clock size={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Lead Funnel">
          <FunnelChart stages={funnelStages} />
        </ChartCard>

        <ChartCard title="Lead Source Breakdown">
          <PieChartWidget data={sourceDistribution} />
        </ChartCard>

        <ChartCard title="Monthly Lead Volume" description="By stage, last 12 months" className="lg:col-span-2">
          <BarChartWidget
            data={monthlyLeads}
            xKey="month"
            bars={[
              { dataKey: 'NEW', color: '#94a3b8', name: 'New' },
              { dataKey: 'QUALIFIED', color: '#60a5fa', name: 'Qualified' },
              { dataKey: 'NEGOTIATION', color: '#f59e0b', name: 'Negotiation' },
              { dataKey: 'ENROLLED', color: '#10b981', name: 'Enrolled' },
              { dataKey: 'LOST', color: '#ef4444', name: 'Lost' },
            ]}
            stacked
          />
        </ChartCard>

        <ChartCard title="Lost Reason Analysis">
          <BarChartWidget
            data={lostReasonData}
            xKey="reason"
            bars={[{ dataKey: 'count', color: '#ef4444', name: 'Lost Leads' }]}
            layout="vertical"
            height={Math.max(200, lostReasonData.length * 35)}
          />
        </ChartCard>

        <ChartCard title="Course Interest" description="Top 10 courses by lead interest">
          <BarChartWidget
            data={courseInterestData}
            xKey="course"
            bars={[{ dataKey: 'count', color: '#8b5cf6', name: 'Leads' }]}
            layout="vertical"
            height={350}
          />
        </ChartCard>

        <ChartCard title="CSR Performance" className="lg:col-span-2">
          <BarChartWidget
            data={csrData}
            xKey="csr"
            bars={[
              { dataKey: 'leads', color: '#94a3b8', name: 'Total Leads' },
              { dataKey: 'conversions', color: '#10b981', name: 'Conversions' },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  )
}
