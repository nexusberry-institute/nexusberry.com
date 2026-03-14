import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { DollarSign, Users, Briefcase } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { PieChartWidget } from '../_components/charts/PieChartWidget'

export default async function StaffAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString()

  const [teachers, staffs, recentAttendance, classRecords] = await Promise.all([
    payload.find({
      collection: 'teachers',
      limit: 200,
      depth: 0,
      select: { fullName: true, nick: true, payMode: true, payPerLecture: true, fixPay: true },
      pagination: false,
    }),
    payload.find({
      collection: 'staffs',
      limit: 200,
      depth: 0,
      select: { fullName: true, nick: true, payMode: true, payPerAdmission: true, fixPay: true },
      pagination: false,
    }),
    payload.find({
      collection: 'attendance',
      where: { date: { greater_than_equal: threeMonthsAgo } },
      limit: 5000,
      depth: 1,
      select: { batch: true, date: true },
      pagination: false,
    }),
    payload.find({
      collection: 'class-records',
      where: { date: { greater_than_equal: startOfMonth } },
      limit: 5000,
      depth: 1,
      select: { employee: true, date: true },
      pagination: false,
    }),
  ])

  // KPIs
  // Estimate monthly teacher cost: FIX teachers get fixPay, PER_LECTURE get payPerLecture * classes this month
  const teacherClassesThisMonth: Record<string, number> = {}
  recentAttendance.docs
    .filter((a) => a.date && a.date >= startOfMonth)
    .forEach((a) => {
      const batchObj = typeof a.batch === 'object' && a.batch !== null ? a.batch : null
      if (!batchObj) return
      const batchTeachers = Array.isArray(batchObj.teachers) ? batchObj.teachers : []
      batchTeachers.forEach((t: any) => {
        const tId = typeof t === 'object' && t !== null ? String(t.id) : String(t)
        teacherClassesThisMonth[tId] = (teacherClassesThisMonth[tId] || 0) + 1
      })
    })

  let monthlyTeacherCost = 0
  teachers.docs.forEach((t) => {
    if (t.payMode === 'FIX') {
      monthlyTeacherCost += (t.fixPay as number) || 0
    } else if (t.payMode === 'PER_LECTURE') {
      const classes = teacherClassesThisMonth[String(t.id)] || 0
      monthlyTeacherCost += classes * ((t.payPerLecture as number) || 0)
    }
  })

  let monthlyStaffCost = 0
  staffs.docs.forEach((s) => {
    if (s.payMode === 'FIX' || s.payMode === 'FIX_PLUS_PER_ADMISSION') {
      monthlyStaffCost += (s.fixPay as number) || 0
    }
  })

  // Contractor billing this month (class-records → classes-employee)
  const contractorClasses: Record<string, { name: string; count: number }> = {}
  classRecords.docs.forEach((cr) => {
    const emp = typeof cr.employee === 'object' && cr.employee ? cr.employee : null
    if (!emp) return
    const id = String((emp as any).id)
    if (!contractorClasses[id]) {
      contractorClasses[id] = { name: (emp as any).name || 'Unknown', count: 0 }
    }
    contractorClasses[id]!.count++
  })

  // Teacher cost breakdown chart
  const teacherCostData = teachers.docs
    .map((t) => {
      const name = t.nick || t.fullName || 'Unknown'
      let cost = 0
      if (t.payMode === 'FIX') {
        cost = (t.fixPay as number) || 0
      } else if (t.payMode === 'PER_LECTURE') {
        const classes = teacherClassesThisMonth[String(t.id)] || 0
        cost = classes * ((t.payPerLecture as number) || 0)
      }
      return { teacher: name as string, cost }
    })
    .filter((t) => t.cost > 0)
    .sort((a, b) => b.cost - a.cost)

  // Contractor classes & cost chart
  const contractorData = Object.values(contractorClasses)
    .sort((a, b) => b.count - a.count)
    .map((c) => ({ employee: c.name, classes: c.count }))

  // Teacher workload (classes per month, last 3 months)
  const teacherWorkload: Record<string, { name: string; months: Record<string, number> }> = {}
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = d.toISOString()
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString()
    const monthKey = d.toLocaleDateString('en-US', { month: 'short' })

    recentAttendance.docs
      .filter((a) => a.date && a.date >= monthStart && a.date <= monthEnd)
      .forEach((a) => {
        const batchObj = typeof a.batch === 'object' && a.batch !== null ? a.batch : null
        if (!batchObj) return
        const batchTeachers = Array.isArray(batchObj.teachers) ? batchObj.teachers : []
        batchTeachers.forEach((t: any) => {
          const teacher = typeof t === 'object' && t !== null ? t : null
          if (!teacher) return
          const id = String(teacher.id)
          if (!teacherWorkload[id]) {
            teacherWorkload[id] = {
              name: teacher.nick || teacher.fullName || 'Unknown',
              months: {},
            }
          }
          teacherWorkload[id]!.months[monthKey] = (teacherWorkload[id]!.months[monthKey] || 0) + 1
        })
      })
  }

  const monthKeys = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1)
    return d.toLocaleDateString('en-US', { month: 'short' })
  })

  const workloadData = Object.values(teacherWorkload)
    .map((t) => ({
      teacher: t.name,
      ...Object.fromEntries(monthKeys.map((m) => [m, t.months[m] || 0])),
    }))
    .sort((a, b) => {
      const totalA = monthKeys.reduce((s, m) => s + ((a as any)[m] || 0), 0)
      const totalB = monthKeys.reduce((s, m) => s + ((b as any)[m] || 0), 0)
      return totalB - totalA
    })
    .slice(0, 15)

  // Pay mode distribution
  const teacherPayModes: Record<string, number> = {}
  teachers.docs.forEach((t) => {
    const mode = (t.payMode as string) || 'Unknown'
    teacherPayModes[mode] = (teacherPayModes[mode] || 0) + 1
  })
  const staffPayModes: Record<string, number> = {}
  staffs.docs.forEach((s) => {
    const mode = (s.payMode as string) || 'Unknown'
    staffPayModes[mode] = (staffPayModes[mode] || 0) + 1
  })
  const payModeColors: Record<string, string> = { FIX: '#2563eb', PER_LECTURE: '#10b981', PER_ADMISSION: '#f59e0b', FIX_PLUS_PER_ADMISSION: '#8b5cf6' }
  const allPayModes = { ...teacherPayModes }
  Object.entries(staffPayModes).forEach(([mode, count]) => {
    allPayModes[mode] = (allPayModes[mode] || 0) + count
  })
  const payModeDistribution = Object.entries(allPayModes).map(([name, value]) => ({
    name,
    value,
    color: payModeColors[name] || '#6b7280',
  }))

  const workloadBars = monthKeys.map((m, i) => ({
    dataKey: m,
    color: ['#2563eb', '#10b981', '#f59e0b'][i]!,
    name: m,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff & Payroll</h1>
        <p className="text-sm text-gray-500 mt-1">Cost tracking, contractor billing, and workload distribution</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Teacher Cost (Month Est.)" value={`Rs ${monthlyTeacherCost.toLocaleString()}`} icon={<DollarSign size={20} />} />
        <KpiCard label="Staff Cost (Month)" value={`Rs ${monthlyStaffCost.toLocaleString()}`} icon={<DollarSign size={20} />} />
        <KpiCard label="Active Teachers" value={teachers.docs.length} icon={<Users size={20} />} />
        <KpiCard label="Active Staff" value={staffs.docs.length} icon={<Briefcase size={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Teacher Cost Breakdown" description="Estimated monthly cost per teacher">
          <BarChartWidget
            data={teacherCostData}
            xKey="teacher"
            bars={[{ dataKey: 'cost', color: '#2563eb', name: 'Cost (Rs)' }]}
            layout="vertical"
            height={Math.max(250, teacherCostData.length * 35)}
          />
        </ChartCard>

        <ChartCard title="Contractor Classes" description="This month">
          <BarChartWidget
            data={contractorData}
            xKey="employee"
            bars={[{ dataKey: 'classes', color: '#10b981', name: 'Classes' }]}
            layout="vertical"
            height={Math.max(200, contractorData.length * 35)}
          />
        </ChartCard>

        <ChartCard title="Teacher Workload" description="Classes per teacher, last 3 months" className="lg:col-span-2">
          <BarChartWidget
            data={workloadData}
            xKey="teacher"
            bars={workloadBars}
            height={400}
          />
        </ChartCard>

        <ChartCard title="Pay Mode Distribution" description="All teachers + staff">
          <PieChartWidget data={payModeDistribution} />
        </ChartCard>
      </div>
    </div>
  )
}
