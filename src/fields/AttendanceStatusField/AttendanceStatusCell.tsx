'use client'
import React from 'react'
import './index.scss'

type AttendanceStatusCellProps = {
  cellData: string | null | undefined
}

export const AttendanceStatusCell: React.FC<AttendanceStatusCellProps> = ({ cellData }) => {
  const status = cellData || 'ABSENT'
  const modifier = status.toLowerCase()

  return (
    <span className={`attendance-status-pill attendance-status-pill--${modifier}`}>
      {status}
    </span>
  )
}
