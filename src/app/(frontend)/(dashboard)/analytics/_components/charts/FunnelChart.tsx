'use client'

type FunnelStage = {
  label: string
  value: number
  color: string
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const maxValue = Math.max(...stages.map((s) => s.value), 1)

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const widthPct = Math.max((stage.value / maxValue) * 100, 8)
        const dropOff =
          i > 0 && stages[i - 1]!.value > 0
            ? (((stages[i - 1]!.value - stage.value) / stages[i - 1]!.value) * 100).toFixed(1)
            : null
        return (
          <div key={stage.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">{stage.label}</span>
              <span className="text-gray-500">
                {stage.value}
                {dropOff !== null && (
                  <span className="ml-2 text-red-500">-{dropOff}%</span>
                )}
              </span>
            </div>
            <div className="h-7 rounded bg-gray-100">
              <div
                className="h-full rounded transition-all"
                style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
