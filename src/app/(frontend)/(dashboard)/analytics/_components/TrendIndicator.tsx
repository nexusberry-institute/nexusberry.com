import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function TrendIndicator({ value, label }: { value: number; label?: string }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
        <Minus size={14} />
        <span>0%{label ? ` ${label}` : ''}</span>
      </span>
    )
  }

  const isPositive = value > 0

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
    >
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>
        {isPositive ? '+' : ''}
        {value.toFixed(1)}%{label ? ` ${label}` : ' vs last month'}
      </span>
    </span>
  )
}
