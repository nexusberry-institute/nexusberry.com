'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ExportButtonProps = {
  data: Record<string, string | number>[]
  filename: string
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    if (!data.length) return
    const headers = Object.keys(data[0]!)
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => {
          const val = String(row[h] ?? '')
          return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
        }).join(','),
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
      <Download size={14} />
      Export CSV
    </Button>
  )
}
