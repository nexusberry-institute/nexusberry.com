import { Table, Radio, Select, Button, Checkbox, ConfigProvider, theme } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { toast } from "@payloadcms/ui"

import { updateAttendanceDetail } from './queryAttendanceDetails'
import { AttendanceRecord } from '.'

export default function AttendanceTable({ attendanceRecords, refresh }: {
  attendanceRecords: AttendanceRecord[],
  refresh: () => void
}) {

  const [changedRecords, setChangedRecords] = useState<Map<string, "PRESENT" | "ABSENT" | "LEAVE" | null>>(new Map())
  const [markAllPresent, setMarkAllPresent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMarkAllPresent = (checked: boolean) => {
    setMarkAllPresent(checked)
    if (checked) {
      // Mark all as present
      const newChanges = new Map()
      attendanceRecords.forEach(record => {
        const recordId = record.enrollmentId.toString()
        newChanges.set(recordId, 'PRESENT')
      })
      setChangedRecords(newChanges)
    } else {
      setChangedRecords(new Map())
    }
  }

  const handleStatusChange = ({ id, status }: { id: string, status: "PRESENT" | "ABSENT" | "LEAVE" }) => {

    const originalRecord = attendanceRecords.find(record => record.enrollmentId.toString() === id)

    if (status === originalRecord?.status) {
      // Remove record if values match original
      const newMap = new Map(changedRecords)
      newMap.delete(id)

      setChangedRecords(newMap)
      setMarkAllPresent(false)
    } else {
      // Only store if values are different
      if (changedRecords.size + 1 === attendanceRecords.length) {
        setMarkAllPresent(true)
      }

      setChangedRecords(prev => new Map(prev).set(id, status))
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const updates = Array.from(changedRecords, ([id, status]) => ({
        id: Number(id),
        status
      }))

      setChangedRecords(new Map())
      toast.success("Attendance updated successfully")
      refresh()
    } catch (err) {
      console.log(err)
      toast.error('Failed to update attendance')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'Sr',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Enrollment Slug',
      dataIndex: 'enrollmentSlug',
      key: 'enrollmentSlug',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const recordId = record.enrollmentId.toString()
        return (
          <Radio.Group
            value={changedRecords.get(recordId) || status}
            onChange={(e) => handleStatusChange({ id: recordId, status: e.target.value })}
          >
            <Radio value="PRESENT">Present</Radio>
            <Radio value="ABSENT">Absent</Radio>
            <Radio value="LEAVE">Leave</Radio>
          </Radio.Group>
        )
      },
    },
    {
      title: 'Medium',
      dataIndex: 'medium',
      key: 'medium',
      render: (medium) => {
        return (
          <Select
            value={medium}
            style={{ width: 120 }}
            options={[
              { value: 'PHYSICAL', label: 'Physical' },
              { value: 'ONLINE', label: 'Online' },
            ]}
          />
        )
      }
    },
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <div className="mb-4 float-end">
        <Checkbox
          onChange={(e) => handleMarkAllPresent(e.target.checked)}
          checked={markAllPresent}
        >
          Mark All Present
        </Checkbox>
      </div>
      <Table
        columns={columns}
        dataSource={attendanceRecords}
        rowKey={(record) => record.enrollmentId.toString()}
        pagination={false}
        style={{ background: "black", color: "white" }}
        footer={() => `Total Enrollments: ${attendanceRecords.length}`}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={changedRecords.size === 0}
        className="mt-4 float-end"
      >
        Submit Changes
      </Button>
    </ConfigProvider>
  )
}
