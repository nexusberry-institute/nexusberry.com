'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

type Status = 'PRESENT' | 'ABSENT' | 'LEAVE'

interface Batch {
  id: number
  courseTitle: string
  slug: string
}

interface StudentRow {
  studentId: number
  fullName: string
  status: Status
}

interface CreateAttendanceFormProps {
  teacherId: number
  batches: Batch[]
}

function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function CreateAttendanceForm({ teacherId, batches }: CreateAttendanceFormProps) {
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [staffNotes, setStaffNotes] = useState('')
  const [selectedDate, setSelectedDate] = useState(getTodayDateString)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchStudents = useCallback(async (batchIds: number[]) => {
    if (batchIds.length === 0) {
      setStudents([])
      return
    }

    setLoadingStudents(true)
    try {
      const res = await fetch(`/api/create-attendance/students?batchIds=${batchIds.join(',')}`)
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Failed to load students', variant: 'destructive' })
        return
      }
      setStudents(data.students.map((s: { id: number; fullName: string }) => ({
        studentId: s.id,
        fullName: s.fullName,
        status: 'ABSENT' as Status,
      })))
    } catch {
      toast({ title: 'Error', description: 'Failed to load students', variant: 'destructive' })
    } finally {
      setLoadingStudents(false)
    }
  }, [toast])

  function toggleBatch(batchId: number) {
    const next = selectedBatchIds.includes(batchId)
      ? selectedBatchIds.filter(id => id !== batchId)
      : [...selectedBatchIds, batchId]
    setSelectedBatchIds(next)
    fetchStudents(next)
  }

  function setStatus(studentId: number, status: Status) {
    setStudents(prev =>
      prev.map(s => s.studentId === studentId ? { ...s, status } : s),
    )
  }

  function markAllPresent() {
    setStudents(prev => prev.map(s => ({ ...s, status: 'PRESENT' })))
  }

  async function handleSubmit() {
    if (selectedBatchIds.length === 0) {
      toast({ title: 'Error', description: 'Select at least one batch', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/create-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchIds: selectedBatchIds,
          teacherId,
          date: selectedDate,
          staffNotes: staffNotes || undefined,
          records: students.map(s => ({
            studentId: s.studentId,
            status: s.status,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Failed to create attendance', variant: 'destructive' })
        return
      }

      toast({
        title: 'Attendance Created',
        description: `${data.detailsCreated} student records created`,
        variant: 'success',
      })
      router.push(`/teacher/attendance/${data.attendanceId}`)
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const statuses: Status[] = ['PRESENT', 'ABSENT', 'LEAVE']

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label htmlFor="sessionDate" className="block text-sm font-semibold text-gray-900 mb-2">
          Session Date
        </label>
        <input
          id="sessionDate"
          type="date"
          value={selectedDate}
          max={getTodayDateString()}
          onChange={e => setSelectedDate(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Batch Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Select Batches</h2>
        {batches.length === 0 ? (
          <p className="text-sm text-gray-500">No active batches assigned to you.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {batches.map(batch => (
              <button
                key={batch.id}
                type="button"
                onClick={() => toggleBatch(batch.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors text-left ${selectedBatchIds.includes(batch.id)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <span className="block">{batch.courseTitle}</span>
                <span className={`block text-xs mt-0.5 ${selectedBatchIds.includes(batch.id) ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                  {batch.slug}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Students Table */}
      {loadingStudents ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Loading students...</p>
        </div>
      ) : selectedBatchIds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
            {students.length > 0 && (
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                Mark All Present
              </Button>
            )}
          </div>

          {students.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, idx) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="text-gray-500">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {statuses.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setStatus(student.studentId, s)}
                              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${student.status === s
                                  ? s === 'PRESENT'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : s === 'ABSENT'
                                      ? 'bg-red-100 text-red-800 border-red-300'
                                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Staff Notes */}
      {selectedBatchIds.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label htmlFor="staffNotes" className="block text-sm font-semibold text-gray-900 mb-2">
            Staff Notes (optional)
          </label>
          <textarea
            id="staffNotes"
            value={staffNotes}
            onChange={e => setStaffNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Add any notes about this session..."
          />
        </div>
      )}

      {/* Submit */}
      {selectedBatchIds.length > 0 && students.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating Attendance...' : 'Create Attendance Session'}
          </Button>
        </div>
      )}
    </div>
  )
}
