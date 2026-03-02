'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface StudentRow {
  studentId: number
  fullName: string
  status: Status
  medium?: 'ONLINE' | 'PHYSICAL' | null
}

interface MarkAttendanceFormProps {
  attendanceId: number
  students: StudentRow[]
}

export function MarkAttendanceForm({ attendanceId, students: initialStudents }: MarkAttendanceFormProps) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  function setStatus(studentId: number, status: Status) {
    setStudents(prev =>
      prev.map(s => s.studentId === studentId ? { ...s, status } : s),
    )
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendanceId,
          records: students.map(s => ({
            studentId: s.studentId,
            status: s.status,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save attendance',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Attendance Saved',
        description: `${data.created} created, ${data.updated} updated`,
        variant: 'success',
      })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const statuses: Status[] = ['PRESENT', 'ABSENT', 'LEAVE']

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Medium</TableHead>
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
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          student.status === s
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
                <TableCell className="text-center">
                  {student.medium === 'ONLINE' && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Online</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No enrolled students found for this session.</p>
      ) : (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      )}
    </div>
  )
}
