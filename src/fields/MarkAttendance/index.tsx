"use client"

import { useFormFields } from '@payloadcms/ui'
import { getAttendanceDetails } from './queryAttendanceDetails'
import { useEffect, useState } from 'react'
import AttandanceTable from './AttandanceTable'
import { useParams } from 'next/navigation'

export type AttendanceRecord = {
  enrollmentId: number;
  attendenceDetailId: undefined;
  enrollmentSlug: string;
  medium: "PHYSICAL";
  status: "ABSENT"
} | {
  enrollmentId: number;
  attendenceDetailId: number;
  enrollmentSlug: string;
  medium: "PHYSICAL" | "ONLINE" | null | undefined;
  status: "PRESENT" | "ABSENT" | "LEAVE";
}

export default function MarkAttendance() {

  const { segments } = useParams()
  const operation = segments?.[2]

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [triggerRefresh, setTriggerRefresh] = useState(false)

  const batchIds = useFormFields(([fields]) => fields.batches?.value) as number[]
  const result = useFormFields(([fields]) => fields.relatedAttendanceDetails?.value) as { docs: number[] } | undefined
  const attendanceDetailIds = result?.docs || []

  useEffect(() => {
    if (operation !== "create") {
      const fetchAttendanceRecords = async () => {
        setIsLoading(true)
        try {
          const attendanceDetails = await getAttendanceDetails(batchIds, attendanceDetailIds)
          setAttendanceRecords(attendanceDetails)
        } catch (err) {
          console.log(err)
          setError(err instanceof Error ? err.message : String(err))
        } finally {
          setIsLoading(false)
        }
      }

      fetchAttendanceRecords()
    } else {
      setAttendanceRecords([])
    }
  }, [batchIds, result, triggerRefresh, operation])

  if (operation === "create") {
    return <h1>It will be available once you saved</h1>
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error: {error}</h1>
  }

  if (!attendanceRecords?.length) {
    return <div>No Details Found</div>
  }

  return <AttandanceTable
    attendanceRecords={attendanceRecords}
    refresh={() => setTriggerRefresh(!triggerRefresh)}
  />

}