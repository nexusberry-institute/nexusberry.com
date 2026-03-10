import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRole } from '@/access/checkRole'
import type { User } from '@/payload-types'
import { DollarSign, Target, CalendarCheck, Star, MousePointerClick } from 'lucide-react'
import { KpiCard } from '../_components/KpiCard'
import { ChartCard } from '../_components/ChartCard'
import { BarChartWidget } from '../_components/charts/BarChartWidget'
import { PieChartWidget } from '../_components/charts/PieChartWidget'

export default async function MarketingAnalyticsPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user: authUser } = await payload.auth({ headers })

  if (!authUser || authUser.collection !== 'users') return null
  const user = authUser as User
  if (!checkRole(['superadmin', 'admin'], user)) redirect('/dashboard')

  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()

  const [campaigns, events, eventFeedbacks, redirects, posts, leads] = await Promise.all([
    payload.find({
      collection: 'campaigns',
      limit: 200,
      depth: 0,
      select: { name: true, budget: true, startDate: true, endDate: true, platform: true },
      pagination: false,
    }),
    payload.find({
      collection: 'events',
      limit: 200,
      depth: 0,
      select: { title: true, totalRegistrations: true, campaignRegistrations: true, startDateTime: true },
      pagination: false,
    }),
    payload.find({
      collection: 'event-feedbacks',
      limit: 5000,
      depth: 0,
      select: { rating: true, reason: true },
      pagination: false,
    }),
    payload.find({
      collection: 'platform-redirects',
      limit: 200,
      depth: 0,
      select: { title: true, platform: true, clicks: true },
      pagination: false,
    }),
    payload.find({
      collection: 'posts',
      where: { publishedAt: { greater_than_equal: twelveMonthsAgo } },
      limit: 500,
      depth: 0,
      select: { publishedAt: true },
      pagination: false,
    }),
    payload.find({
      collection: 'leads',
      where: { createdAt: { greater_than_equal: twelveMonthsAgo } },
      limit: 0,
      depth: 0,
      select: { source: true },
    }),
  ])

  // KPIs
  const totalSpend = campaigns.docs.reduce((s, c) => s + ((c.budget as number) || 0), 0)
  const totalLeads = leads.totalDocs
  const costPerLead = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0
  const totalEventRegistrations = events.docs.reduce((s, e) => s + ((e.totalRegistrations as number) || 0), 0)
  const avgRating =
    eventFeedbacks.docs.length > 0
      ? eventFeedbacks.docs.reduce((s, f) => s + ((f.rating as number) || 0), 0) / eventFeedbacks.docs.length
      : 0
  const totalClicks = redirects.docs.reduce((s, r) => s + ((r.clicks as number) || 0), 0)

  // Campaign ROI table
  const campaignROI = campaigns.docs.map((c) => ({
    name: (c.name as string) || 'Unknown',
    budget: (c.budget as number) || 0,
    platform: (c.platform as string) || 'N/A',
  }))

  // Event registrations vs campaign registrations
  const eventRegData = events.docs
    .filter((e) => (e.totalRegistrations as number) > 0)
    .sort((a, b) => ((b.totalRegistrations as number) || 0) - ((a.totalRegistrations as number) || 0))
    .slice(0, 10)
    .map((e) => ({
      event: ((e.title as string) || 'Unknown').slice(0, 25),
      total: (e.totalRegistrations as number) || 0,
      campaign: (e.campaignRegistrations as number) || 0,
    }))

  // Feedback rating distribution
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  eventFeedbacks.docs.forEach((f) => {
    const r = (f.rating as number) || 0
    if (r >= 1 && r <= 5) ratingCounts[r]!++
  })
  const ratingData = Object.entries(ratingCounts).map(([rating, count]) => ({
    rating: `${rating} Star`,
    count,
  }))

  // Feedback reason breakdown
  const reasonCounts: Record<string, number> = {}
  eventFeedbacks.docs.forEach((f) => {
    const reason = (f.reason as string) || 'Unknown'
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
  })
  const reasonColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  const reasonDistribution = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value], i) => ({ name, value, color: reasonColors[i % reasonColors.length]! }))

  // Redirect clicks by platform
  const platformClicks: Record<string, number> = {}
  redirects.docs.forEach((r) => {
    const platform = (r.platform as string) || 'other'
    platformClicks[platform] = (platformClicks[platform] || 0) + ((r.clicks as number) || 0)
  })
  const platformClickData = Object.entries(platformClicks)
    .sort(([, a], [, b]) => b - a)
    .map(([platform, clicks]) => ({ platform, clicks }))

  // Top 10 redirects
  const topRedirects = redirects.docs
    .sort((a, b) => ((b.clicks as number) || 0) - ((a.clicks as number) || 0))
    .slice(0, 10)
    .map((r) => ({ title: (r.title as string) || 'Unknown', clicks: (r.clicks as number) || 0 }))

  // Content publishing cadence (posts/month)
  const monthlyPosts: { month: string; posts: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = d.getTime()
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime()
    const count = posts.docs.filter((p) => {
      if (!p.publishedAt) return false
      const t = new Date(p.publishedAt).getTime()
      return t >= monthStart && t <= monthEnd
    }).length
    monthlyPosts.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      posts: count,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing & Events</h1>
        <p className="text-sm text-gray-500 mt-1">Campaign ROI, event effectiveness, and content performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Campaign Spend" value={`Rs ${totalSpend.toLocaleString()}`} icon={<DollarSign size={20} />} />
        <KpiCard label="Cost Per Lead" value={`Rs ${costPerLead.toLocaleString()}`} icon={<Target size={20} />} />
        <KpiCard label="Event Registrations" value={totalEventRegistrations} icon={<CalendarCheck size={20} />} />
        <KpiCard label="Avg Event Rating" value={avgRating.toFixed(1)} icon={<Star size={20} />} />
        <KpiCard label="Redirect Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick size={20} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign ROI Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Campaign ROI</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Campaign</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Budget</th>
                  <th className="px-6 py-3 text-center font-medium text-gray-500">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaignROI.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No campaigns found</td></tr>
                ) : (
                  campaignROI.map((c, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3 text-gray-900">{c.name}</td>
                      <td className="px-6 py-3 text-right text-gray-700">Rs {c.budget.toLocaleString()}</td>
                      <td className="px-6 py-3 text-center text-gray-500 capitalize">{c.platform}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ChartCard title="Event Registrations" description="Total vs Campaign">
          <BarChartWidget
            data={eventRegData}
            xKey="event"
            bars={[
              { dataKey: 'total', color: '#2563eb', name: 'Total' },
              { dataKey: 'campaign', color: '#f59e0b', name: 'Campaign' },
            ]}
            layout="vertical"
            height={350}
          />
        </ChartCard>

        <ChartCard title="Event Feedback Ratings">
          <BarChartWidget
            data={ratingData}
            xKey="rating"
            bars={[{ dataKey: 'count', color: '#f59e0b', name: 'Responses' }]}
          />
        </ChartCard>

        <ChartCard title="Feedback Reason Breakdown">
          <PieChartWidget data={reasonDistribution} />
        </ChartCard>

        <ChartCard title="Redirect Clicks by Platform">
          <BarChartWidget
            data={platformClickData}
            xKey="platform"
            bars={[{ dataKey: 'clicks', color: '#8b5cf6', name: 'Clicks' }]}
          />
        </ChartCard>

        <ChartCard title="Top 10 Redirects">
          <BarChartWidget
            data={topRedirects}
            xKey="title"
            bars={[{ dataKey: 'clicks', color: '#2563eb', name: 'Clicks' }]}
            layout="vertical"
            height={350}
          />
        </ChartCard>

        <ChartCard title="Content Publishing Cadence" description="Posts per month, last 12 months">
          <BarChartWidget
            data={monthlyPosts}
            xKey="month"
            bars={[{ dataKey: 'posts', color: '#10b981', name: 'Posts' }]}
          />
        </ChartCard>
      </div>
    </div>
  )
}
