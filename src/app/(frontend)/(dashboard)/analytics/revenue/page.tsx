import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { DollarSign, Clock, Skull, Percent } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { PieChartWidget } from '../_components/charts/PieChartWidget'
import { LineChartWidget } from '../_components/charts/LineChartWidget'
import { ExportButton } from '../_components/ExportButton'

export default async function RevenueAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString()
  const today = now.toISOString().split('T')[0]!

  // Fetch all fee receipts with date bounds (last 12 months for charts)
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  const [allReceipts, pendingReceipts, enrollmentCount] = await Promise.all([
    payload.find({
      collection: 'fee-receipts',
      where: { createdAt: { greater_than_equal: twelveMonthsAgo } },
      limit: 5000,
      depth: 0,
      select: { amount: true, paidMethod: true, payDate: true, status: true, dueDate: true, installmentNumber: true },
      pagination: false,
    }),
    payload.find({
      collection: 'fee-receipts',
      where: { status: { equals: 'PENDING' }, dueDate: { less_than: today } },
      limit: 100,
      depth: 1,
      select: { amount: true, dueDate: true, student: true },
    }),
    payload.count({
      collection: 'enrollments',
      where: { status: { equals: 'active' } },
    }),
  ])

  const receipts = allReceipts.docs

  // KPI calculations
  const receivedThisMonth = receipts.filter(
    (r) => r.status === 'RECEIVED' && r.payDate && r.payDate >= startOfMonth,
  )
  const receivedThisQuarter = receipts.filter(
    (r) => r.status === 'RECEIVED' && r.payDate && r.payDate >= startOfQuarter,
  )
  const allReceived = receipts.filter((r) => r.status === 'RECEIVED')
  const allPending = receipts.filter((r) => r.status === 'PENDING')
  const allDead = receipts.filter((r) => r.status === 'DEAD')

  const totalCollectedMonth = receivedThisMonth.reduce((s, r) => s + (r.amount || 0), 0)
  const totalCollectedQuarter = receivedThisQuarter.reduce((s, r) => s + (r.amount || 0), 0)
  const totalCollectedAll = allReceived.reduce((s, r) => s + (r.amount || 0), 0)
  const totalPending = allPending.reduce((s, r) => s + (r.amount || 0), 0)
  const totalDead = allDead.reduce((s, r) => s + (r.amount || 0), 0)
  const collectionRate = receipts.length > 0 ? (allReceived.length / receipts.length) * 100 : 0

  // Monthly revenue by payment method
  const monthlyByMethod: Record<string, Record<string, number>> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    monthlyByMethod[key] = { BANK: 0, CASH: 0, JAZZCASH: 0, EASYPAISA: 0 }
  }
  allReceived.forEach((r) => {
    if (!r.payDate) return
    const d = new Date(r.payDate)
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const method = (r.paidMethod as string) || 'CASH'
    if (monthlyByMethod[key]) {
      monthlyByMethod[key]![method] = (monthlyByMethod[key]![method] || 0) + (r.amount || 0)
    }
  })
  const monthlyRevenueData = Object.entries(monthlyByMethod).map(([month, methods]) => ({
    month,
    ...methods,
  }))

  // Fee status distribution
  const statusDistribution = [
    { name: 'Received', value: allReceived.length, color: '#10b981' },
    { name: 'Pending', value: allPending.length, color: '#f59e0b' },
    { name: 'Dead', value: allDead.length, color: '#ef4444' },
  ]

  // Payment method breakdown
  const methodCounts: Record<string, number> = {}
  allReceived.forEach((r) => {
    const m = (r.paidMethod as string) || 'CASH'
    methodCounts[m] = (methodCounts[m] || 0) + 1
  })
  const methodColors: Record<string, string> = { BANK: '#2563eb', CASH: '#10b981', JAZZCASH: '#f59e0b', EASYPAISA: '#8b5cf6' }
  const methodDistribution = Object.entries(methodCounts).map(([name, value]) => ({
    name,
    value,
    color: methodColors[name] || '#6b7280',
  }))

  // Overdue aging buckets
  const agingBuckets = { '0-7d': 0, '8-30d': 0, '31-60d': 0, '60+d': 0 }
  const nowMs = now.getTime()
  pendingReceipts.docs.forEach((r) => {
    if (!r.dueDate) return
    const daysOverdue = Math.floor((nowMs - new Date(r.dueDate).getTime()) / 86400000)
    if (daysOverdue <= 7) agingBuckets['0-7d']++
    else if (daysOverdue <= 30) agingBuckets['8-30d']++
    else if (daysOverdue <= 60) agingBuckets['31-60d']++
    else agingBuckets['60+d']++
  })
  const agingData = Object.entries(agingBuckets).map(([bucket, count]) => ({ bucket, count }))

  // Installment drop-off
  const installmentAmounts: Record<number, { count: number; total: number }> = {}
  receipts.forEach((r) => {
    const num = (r.installmentNumber as number) || 1
    if (!installmentAmounts[num]) installmentAmounts[num] = { count: 0, total: 0 }
    installmentAmounts[num]!.count++
    installmentAmounts[num]!.total += r.amount || 0
  })
  const installmentData = Object.entries(installmentAmounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([num, data]) => ({ installment: `#${num}`, count: data.count }))

  // Top overdue accounts for table
  const overdueAccounts = pendingReceipts.docs
    .filter((r) => r.dueDate && new Date(r.dueDate) < now)
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 10)
    .map((r) => {
      const studentName =
        typeof r.student === 'object' && r.student ? (r.student as any).fullName || 'Unknown' : `#${r.student}`
      const daysOverdue = r.dueDate ? Math.floor((nowMs - new Date(r.dueDate).getTime()) / 86400000) : 0
      return {
        student: studentName,
        amount: r.amount || 0,
        daysOverdue,
      }
    })

  const exportData = overdueAccounts.map((a) => ({
    Student: a.student,
    Amount: a.amount,
    'Days Overdue': a.daysOverdue,
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue & Fees</h1>
          <p className="text-sm text-gray-500 mt-1">Financial health and collection tracking</p>
        </div>
        <ExportButton data={exportData} filename="overdue-report" />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Collected (Month)" value={`Rs ${totalCollectedMonth.toLocaleString()}`} icon={<DollarSign size={20} />} />
        <KpiCard label="Collected (Quarter)" value={`Rs ${totalCollectedQuarter.toLocaleString()}`} icon={<DollarSign size={20} />} />
        <KpiCard label="Pending Amount" value={`Rs ${totalPending.toLocaleString()}`} icon={<Clock size={20} />} alert={totalPending > 0} />
        <KpiCard label="Dead Amount" value={`Rs ${totalDead.toLocaleString()}`} icon={<Skull size={20} />} />
        <KpiCard label="Collection Rate" value={`${collectionRate.toFixed(1)}%`} icon={<Percent size={20} />} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Revenue by Payment Method" className="lg:col-span-2">
          <BarChartWidget
            data={monthlyRevenueData}
            xKey="month"
            bars={[
              { dataKey: 'BANK', color: '#2563eb', name: 'Bank' },
              { dataKey: 'CASH', color: '#10b981', name: 'Cash' },
              { dataKey: 'JAZZCASH', color: '#f59e0b', name: 'JazzCash' },
              { dataKey: 'EASYPAISA', color: '#8b5cf6', name: 'Easypaisa' },
            ]}
            stacked
          />
        </ChartCard>

        <ChartCard title="Fee Status Distribution">
          <PieChartWidget data={statusDistribution} />
        </ChartCard>

        <ChartCard title="Payment Method Breakdown">
          <PieChartWidget data={methodDistribution} />
        </ChartCard>

        <ChartCard title="Overdue Aging Buckets">
          <BarChartWidget
            data={agingData}
            xKey="bucket"
            bars={[{ dataKey: 'count', color: '#ef4444', name: 'Overdue Receipts' }]}
          />
        </ChartCard>

        <ChartCard title="Installment Drop-off">
          <LineChartWidget
            data={installmentData}
            xKey="installment"
            lines={[{ dataKey: 'count', color: '#8b5cf6', name: 'Receipts' }]}
          />
        </ChartCard>
      </div>

      {/* Top Overdue Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Top 10 Overdue Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueAccounts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No overdue accounts</td>
                </tr>
              ) : (
                overdueAccounts.map((account, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 text-gray-900">{account.student}</td>
                    <td className="px-6 py-3 text-right text-gray-900">Rs {account.amount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${account.daysOverdue > 30 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {account.daysOverdue}d
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
