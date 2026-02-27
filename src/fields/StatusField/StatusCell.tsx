'use client'
import React from 'react'
import './index.scss'

type StatusCellProps = {
  cellData: string | null | undefined
}

export const StatusCell: React.FC<StatusCellProps> = ({ cellData }) => {
  const status = cellData || 'PENDING'
  const modifier = status.toLowerCase()

  return (
    <span className={`status-pill status-pill--${modifier}`}>
      {status}
    </span>
  )
}
