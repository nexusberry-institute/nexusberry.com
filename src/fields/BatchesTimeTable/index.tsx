"use client"
import React, { useEffect, useState } from "react"
import { useFormFields } from '@payloadcms/ui'
import { TimeTable } from "@/payload-types"
import { getTimeTable } from "./getTimeTable"
import { Loader } from "lucide-react"
import { format } from "date-fns"
import './TimeTable.css';

export default function BatchesTimeTable() {
  const [timeTable, setTimeTable] = useState<TimeTable[] | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const batchesId = useFormFields(([fields]) => fields.batches?.value) as number[]

  useEffect(() => {
    const fetchTimeTable = async () => {
      setLoading(true)
      setError(undefined)
      try {
        if (batchesId && batchesId.length) {
          const result = await getTimeTable(batchesId)
          setTimeTable(result)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    fetchTimeTable()
  }, [batchesId])

  if (error) {
    return (
      <div>
        <h3>Selected Batches Time Table</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <p>Selected batch Time Table</p>
        <p>Loading....
          <span><Loader className="animate-spin" /></span>
        </p>
      </div>
    )
  }

  if (!timeTable || !timeTable.length) {
    return (
      <div>
        <p>Selected batch Time Table</p>
        <p>Select a batch to see its time table</p>
      </div>
    )
  }

  return (
    <div className="overflow-scroll">
      <p>Selected batch Time Table :</p>
      <table className="mytable">
        <thead>
          <tr>
            <th>Id</th>
            <th>batch</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Room</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {timeTable.map(tt => (
            <tr key={tt.id}>
              <td>{tt.id}</td>
              <td>{typeof tt.batch === "number" ? tt.batch : tt.batch.slug}</td>
              <td>{tt.day}</td>
              <td>{format(tt.startTime, "p")}</td>
              <td>{format(tt.endTime, "p")}</td>
              <td>{tt.room || "N/A"}</td>
              <td>{format(tt.createdAt, "dd/mm/yyyy p")}</td>
              <td>{format(tt.updatedAt, "dd/mm/yyyy p")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}
