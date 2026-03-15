'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

type Status = 'PRESENT' | 'ABSENT' | 'LEAVE'
type Medium = 'ONLINE' | 'PHYSICAL'
type Filter = 'ALL' | Status | Medium

interface StudentRow {
  studentId: number
  fullName: string
  status: Status
  medium?: Medium | null
}

interface UpdateAttendanceFormProps {
  attendanceId: number
  students: StudentRow[]
  backHref?: string
  date?: string
  batchName?: string
}

const FILTER_STYLES: Record<Filter, { active: string; inactive: string }> = {
  ALL: {
    active: 'bg-gray-900 text-white border-gray-900',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
  PRESENT: {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
  ABSENT: {
    active: 'bg-red-100 text-red-800 border-red-300',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
  LEAVE: {
    active: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
  ONLINE: {
    active: 'bg-blue-100 text-blue-800 border-blue-300',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
  PHYSICAL: {
    active: 'bg-purple-100 text-purple-800 border-purple-300',
    inactive: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
  },
}

export function UpdateAttendanceForm({
  attendanceId,
  students: initialStudents,
  backHref = '/teacher/attendance',
  date,
  batchName,
}: UpdateAttendanceFormProps) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents)
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')
  const [submitting, setSubmitting] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const initialRef = useRef<StudentRow[]>(initialStudents)

  const dirtyStudents = useMemo(() => {
    return students.filter((s) => {
      const initial = initialRef.current.find((i) => i.studentId === s.studentId)
      if (!initial) return true
      return s.status !== initial.status || (s.medium ?? 'ONLINE') !== (initial.medium ?? 'ONLINE')
    })
  }, [students])

  const isDirty = dirtyStudents.length > 0

  // Browser beforeunload guard
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const handleBackClick = useCallback(() => {
    if (isDirty) {
      setShowLeaveDialog(true)
    } else {
      router.push(backHref)
    }
  }, [isDirty, router, backHref])

  const counts = useMemo(() => {
    const c = { ALL: students.length, PRESENT: 0, ABSENT: 0, LEAVE: 0, ONLINE: 0, PHYSICAL: 0 }
    for (const s of students) {
      c[s.status]++
      const m = s.medium ?? 'ONLINE'
      c[m]++
    }
    return c
  }, [students])

  const filteredStudents = useMemo(() => {
    if (activeFilter === 'ALL') return students
    if (activeFilter === 'ONLINE' || activeFilter === 'PHYSICAL') {
      return students.filter(s => (s.medium ?? 'ONLINE') === activeFilter)
    }
    return students.filter(s => s.status === activeFilter)
  }, [students, activeFilter])

  function setStatus(studentId: number, status: Status) {
    setStudents(prev =>
      prev.map(s => s.studentId === studentId ? { ...s, status } : s),
    )
  }

  function setMedium(studentId: number, medium: Medium) {
    setStudents(prev =>
      prev.map(s => s.studentId === studentId ? { ...s, medium } : s),
    )
  }

  async function handleSubmit() {
    if (dirtyStudents.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendanceId,
          records: dirtyStudents.map(s => ({
            studentId: s.studentId,
            status: s.status,
            medium: s.medium ?? 'ONLINE',
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
        setSubmitting(false)
        return
      }

      toast({
        title: 'Attendance Saved',
        description: `${data.created} created, ${data.updated} updated`,
        variant: 'success',
      })
      initialRef.current = students.map(s => ({ ...s }))
      router.push(backHref)
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
      setSubmitting(false)
    }
  }

  const statuses: Status[] = ['PRESENT', 'ABSENT', 'LEAVE']
  const filters: Filter[] = ['ALL', 'PRESENT', 'ABSENT', 'LEAVE', 'ONLINE', 'PHYSICAL']

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBackClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Attendance</h1>
          {(date || batchName) && (
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <CalendarDays size={14} />
              {date} {batchName && <span className="text-gray-400">| {batchName}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Unsaved changes dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Stay
            </Button>
            <Button variant="destructive" onClick={() => router.push(backHref)}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics filter pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => {
          const isActive = activeFilter === f
          const style = FILTER_STYLES[f]
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${isActive ? style.active : style.inactive}`}
            >
              {f} ({counts[f]})
            </button>
          )
        })}
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStudents(prev => prev.map(s => ({ ...s, status: 'PRESENT' as Status })))}
        >
          Mark All Present
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStudents(prev => prev.map(s => ({ ...s, status: 'ABSENT' as Status })))}
        >
          Mark All Absent
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
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
            {filteredStudents.map((student, idx) => (
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
                <TableCell className="text-center">
                  <select
                    value={student.medium ?? 'ONLINE'}
                    onChange={e => setMedium(student.studentId, e.target.value as Medium)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="PHYSICAL">Physical</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filteredStudents.map((student, idx) => (
          <div
            key={student.studentId}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{idx + 1}.</span>
              <span className="font-medium text-gray-900">{student.fullName}</span>
            </div>
            <div className="flex flex-wrap gap-2">
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
            <select
              value={student.medium ?? 'ONLINE'}
              onChange={e => setMedium(student.studentId, e.target.value as Medium)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="ONLINE">Online</option>
              <option value="PHYSICAL">Physical</option>
            </select>
          </div>
        ))}
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-gray-500">No enrolled students found for this session.</p>
      ) : (
        <div className="flex justify-center pb-16">
          <Button onClick={handleSubmit} disabled={submitting || !isDirty}>
            {submitting
              ? 'Submitting...'
              : isDirty
                ? `Submit (${dirtyStudents.length} ${dirtyStudents.length === 1 ? 'change' : 'changes'})`
                : 'Submit'}
          </Button>
        </div>
      )}
    </div>
  )
}
