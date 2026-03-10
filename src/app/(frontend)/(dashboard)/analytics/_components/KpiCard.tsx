import { Card, CardContent } from '@/components/ui/card'
import { TrendIndicator } from './TrendIndicator'

type KpiCardProps = {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: number | null
  alert?: boolean
}

export function KpiCard({ label, value, icon, trend, alert }: KpiCardProps) {
  return (
    <Card className={alert ? 'border-red-300 bg-red-50' : ''}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
            {icon}
          </div>
        </div>
        {trend !== undefined && trend !== null && (
          <div className="mt-2">
            <TrendIndicator value={trend} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
