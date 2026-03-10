import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import {
  DollarSign,
  Users,
  UserPlus,
  Target,
  AlertTriangle,
  Layers,
} from 'lucide-react'
import { KpiCard } from './_components/KpiCard'
import { ChartCard } from './_components/ChartCard'
import { AreaChartWidget } from './_components/charts/AreaChartWidget'
import { BarChartWidget } from './_components/charts/BarChartWidget'
import { FunnelChart } from './_components/charts/FunnelChart'
import { Badge } from '@/components/ui/badge'

export default async function AnalyticsOverviewPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) {
    redirect('/dashboard')
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

  const today = now.toISOString().split('T')[0]!
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()

  // Parallel fetch all KPI data
  const [
    revenueThisMonth,
    revenueLastMonth,
    activeStudents,
    admissionsThisMonth,
    leadsThisMonth,
    enrolledLeadsThisMonth,
    overdueReceipts,
    activeBatches,
    // Charts data
    admissionRequests,
    // Alerts
    feesDueSoon,
    batchesEndingSoon,
    leadsWithReminder,
  ] = await Promise.all([
    // Revenue this month
    payload.find({
      collection: 'fee-receipts',
      where: {
        status: { equals: 'RECEIVED' },
        payDate: { greater_than_equal: startOfMonth },
      },
      limit: 0,
      depth: 0,
      select: { amount: true },
    }),
    // Revenue last month
    payload.find({
      collection: 'fee-receipts',
      where: {
        status: { equals: 'RECEIVED' },
        payDate: { greater_than_equal: startOfLastMonth, less_than: startOfMonth },
      },
      limit: 0,
      depth: 0,
      select: { amount: true },
    }),
    // Active students
    payload.count({ collection: 'students', where: { status: { equals: 'active' } } }),
    // Admissions this month
    payload.find({
      collection: 'admission-requests',
      where: {
        status: { in: ['approved', 'processed'] },
        createdAt: { greater_than_equal: startOfMonth },
      },
      limit: 0,
      depth: 0,
    }),
    // Total leads this month
    payload.count({
      collection: 'leads',
      where: { createdAt: { greater_than_equal: startOfMonth } },
    }),
    // Enrolled leads this month
    payload.count({
      collection: 'leads',
      where: {
        stage: { equals: 'ENROLLED' },
        createdAt: { greater_than_equal: startOfMonth },
      },
    }),
    // Overdue fees
    payload.find({
      collection: 'fee-receipts',
      where: {
        status: { equals: 'PENDING' },
        dueDate: { less_than: today },
      },
      limit: 0,
      depth: 0,
      select: { amount: true },
    }),
    // Active batches
    payload.count({ collection: 'batches', where: { active: { equals: true } } }),
    // Admission requests (all statuses for funnel)
    payload.find({
      collection: 'admission-requests',
      where: { createdAt: { greater_than_equal: startOfMonth } },
      limit: 0,
      depth: 0,
      select: { status: true },
    }),
    // Fees due within 7 days
    payload.find({
      collection: 'fee-receipts',
      where: {
        status: { equals: 'PENDING' },
        dueDate: { greater_than_equal: today, less_than_equal: sevenDaysFromNow },
      },
      limit: 5,
      depth: 1,
      select: { amount: true, dueDate: true, student: true },
    }),
    // Batches ending within 2 weeks
    payload.find({
      collection: 'batches',
      where: {
        active: { equals: true },
        endDate: { greater_than_equal: today, less_than_equal: twoWeeksFromNow },
      },
      limit: 5,
      depth: 0,
      select: { courseTitle: true, endDate: true },
    }),
    // Leads with reminders due
    payload.find({
      collection: 'leads',
      where: {
        reminder_date: { less_than_equal: today },
        stage: { not_in: ['ENROLLED', 'LOST'] },
      },
      limit: 5,
      depth: 0,
      select: { name: true, reminder_date: true, stage: true },
    }),
  ])

  // Compute KPIs
  const revThisMonth = revenueThisMonth.docs.reduce((sum, r) => sum + (r.amount || 0), 0)
  const revLastMonth = revenueLastMonth.docs.reduce((sum, r) => sum + (r.amount || 0), 0)
  const revTrend = revLastMonth > 0 ? ((revThisMonth - revLastMonth) / revLastMonth) * 100 : 0
  const conversionRate =
    leadsThisMonth.totalDocs > 0
      ? (enrolledLeadsThisMonth.totalDocs / leadsThisMonth.totalDocs) * 100
      : 0
  const overdueAmount = overdueReceipts.docs.reduce((sum, r) => sum + (r.amount || 0), 0)

  // Revenue trend (last 12 months)
  const revenueTrend: { month: string; revenue: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    revenueTrend.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      revenue: 0,
    })
    // We'll fill this with a separate batch query below
  }

  // Fetch monthly revenue for trend chart
  const monthlyRevenueResults = await Promise.all(
    revenueTrend.map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const monthStart = d.toISOString()
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString()
      return payload.find({
        collection: 'fee-receipts',
        where: {
          status: { equals: 'RECEIVED' },
          payDate: { greater_than_equal: monthStart, less_than_equal: monthEnd },
        },
        limit: 0,
        depth: 0,
        select: { amount: true },
      })
    }),
  )

  monthlyRevenueResults.forEach((result, i) => {
    revenueTrend[i]!.revenue = result.docs.reduce((sum, r) => sum + (r.amount || 0), 0)
  })

  // Admission funnel
  const admissionStatusCounts = { pending: 0, reviewing: 0, approved: 0, processed: 0, rejected: 0 }
  admissionRequests.docs.forEach((ar) => {
    const status = ar.status as keyof typeof admissionStatusCounts
    if (status in admissionStatusCounts) admissionStatusCounts[status]++
  })

  const funnelStages = [
    { label: 'Pending', value: admissionStatusCounts.pending, color: '#94a3b8' },
    { label: 'Reviewing', value: admissionStatusCounts.reviewing, color: '#60a5fa' },
    { label: 'Approved', value: admissionStatusCounts.approved, color: '#34d399' },
    { label: 'Processed', value: admissionStatusCounts.processed, color: '#10b981' },
  ]

  // Lead pipeline (last 6 months)
  const leadPipeline: { month: string; NEW: number; QUALIFIED: number; NEGOTIATION: number; ENROLLED: number; LOST: number }[] = []
  const leadPipelineResults = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const monthStart = d.toISOString()
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString()
      return payload.find({
        collection: 'leads',
        where: { createdAt: { greater_than_equal: monthStart, less_than_equal: monthEnd } },
        limit: 0,
        depth: 0,
        select: { stage: true },
      }).then((res) => ({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        docs: res.docs,
      }))
    }),
  )

  leadPipelineResults.forEach(({ month, docs }) => {
    const counts = { NEW: 0, QUALIFIED: 0, NEGOTIATION: 0, ENROLLED: 0, LOST: 0 }
    docs.forEach((lead) => {
      const stage = lead.stage as keyof typeof counts
      if (stage in counts) counts[stage]++
    })
    leadPipeline.push({ month, ...counts })
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Executive snapshot for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Revenue This Month"
          value={`Rs ${revThisMonth.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          trend={revTrend}
        />
        <KpiCard
          label="Active Students"
          value={activeStudents.totalDocs}
          icon={<Users size={20} />}
        />
        <KpiCard
          label="New Admissions"
          value={admissionsThisMonth.totalDocs}
          icon={<UserPlus size={20} />}
        />
        <KpiCard
          label="Lead Conversion"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<Target size={20} />}
        />
        <KpiCard
          label="Overdue Fees"
          value={`Rs ${overdueAmount.toLocaleString()}`}
          icon={<AlertTriangle size={20} />}
          alert={overdueAmount > 0}
        />
        <KpiCard
          label="Active Batches"
          value={activeBatches.totalDocs}
          icon={<Layers size={20} />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Trend" description="Monthly revenue, last 12 months" className="lg:col-span-2">
          <AreaChartWidget data={revenueTrend} xKey="month" yKey="revenue" color="#2563eb" />
        </ChartCard>

        <ChartCard title="Admissions Funnel" description="This month">
          <FunnelChart stages={funnelStages} />
        </ChartCard>

        <ChartCard title="Lead Pipeline" description="Last 6 months by stage">
          <BarChartWidget
            data={leadPipeline}
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
      </div>

      {/* Alerts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Fees Due Within 7 Days</h3>
          {feesDueSoon.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming fees due.</p>
          ) : (
            <div className="space-y-2">
              {feesDueSoon.docs.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">
                    {typeof fee.student === 'object' && fee.student ? (fee.student as any).fullName : `Student #${fee.student}`}
                  </span>
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                    Rs {(fee.amount || 0).toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Batches Ending Soon</h3>
          {batchesEndingSoon.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No batches ending soon.</p>
          ) : (
            <div className="space-y-2">
              {batchesEndingSoon.docs.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">{batch.courseTitle}</span>
                  <span className="text-xs text-gray-500">
                    {batch.endDate && new Date(batch.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Reminders Due</h3>
          {leadsWithReminder.docs.length === 0 ? (
            <p className="text-sm text-gray-500">No pending reminders.</p>
          ) : (
            <div className="space-y-2">
              {leadsWithReminder.docs.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">{lead.name}</span>
                  <Badge variant="outline" className="text-xs capitalize">{lead.stage}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
