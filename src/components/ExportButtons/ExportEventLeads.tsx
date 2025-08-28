"use client"
import { useState, useEffect } from "react"
import type { BeforeDocumentControlsClientProps } from "payload"
import { ArrowDownToLineIcon, ChevronDownIcon } from "lucide-react"

export function ExportEventLeads(props?: BeforeDocumentControlsClientProps) {
  const [eventId, setEventId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    const id = path.split("/").pop() || ""
    setEventId(id)
  }, [])

  function downloadCSV(filename: string, rows: string[]) {
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  function processLeadsData(
    leads: any[],
    attendanceFilter: "all" | "attended" | "not_attended",
    eventTitle: string
  ) {
    const csvRows = [
      '"Name","Phone","Email","Gender","City","Province","Country","Has Attended","Registration Date"',
    ]

    const filteredLeads = leads.filter((lead) => {
      if (!lead.eventAttendance || !Array.isArray(lead.eventAttendance)) return false

      const eventAttendance = lead.eventAttendance.find((attendance: any) => {
        const attendanceEventId =
          typeof attendance.event === "object" ? attendance.event.id : attendance.event
        return attendanceEventId === eventId
      })

      if (!eventAttendance) return false

      if (attendanceFilter === "attended") return eventAttendance.hasAttended === true
      if (attendanceFilter === "not_attended") return eventAttendance.hasAttended !== true
      return true
    })

    filteredLeads.forEach((lead) => {
      const name = lead.name || ""
      const phone = lead.mobile || ""
      const email = lead.email || ""
      const gender = lead.gender || ""
      const city = lead.city || ""
      const province = lead.province || ""
      const country = lead.country || ""

      const eventAttendance = lead.eventAttendance?.find((attendance: any) => {
        const attendanceEventId =
          typeof attendance.event === "object" ? attendance.event.id : attendance.event
        return attendanceEventId === eventId
      })
      const hasAttended = eventAttendance?.hasAttended ? "Yes" : "No"
      const registrationDate = lead.createdAt
        ? new Date(lead.createdAt).toLocaleDateString()
        : ""

      const safe = (val: string) => (val ? `"${val.replace(/"/g, '""')}"` : "")

      csvRows.push(
        `${safe(name)},${safe(phone)},${safe(email)},${safe(gender)},${safe(
          city
        )},${safe(province)},${safe(country)},"${hasAttended}","${registrationDate}"`
      )
    })

    return { csvRows, count: filteredLeads.length }
  }

  const handleExportLeads = async (attendanceFilter: "all" | "attended" | "not_attended") => {
    setIsLoading(true)
    setShowDropdown(false)

    try {
      const res = await fetch(
        `/api/leads?where[eventAttendance.event][equals]=${eventId}&depth=2&limit=0`,
        {
          credentials: "include",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch leads")

      const data = await res.json()
      if (!data.docs || data.docs.length === 0) {
        alert("No leads found for this event.")
        return
      }

      const eventRes = await fetch(`/api/events/${eventId}`, {
        credentials: "include",
      })
      const eventData = await eventRes.json()
      const eventTitle = eventData.title || "event"

      const { csvRows, count } = processLeadsData(data.docs, attendanceFilter, eventTitle)

      if (count === 0) {
        const filterText =
          attendanceFilter === "all"
            ? "leads"
            : attendanceFilter === "attended"
            ? "attendees"
            : "non-attendees"
        alert(`No ${filterText} found for this event.`)
        return
      }

      const filterSuffix =
        attendanceFilter === "all"
          ? "all_leads"
          : attendanceFilter === "attended"
          ? "attended_leads"
          : "not_attended_leads"

      const filename = `event_${eventId}_${filterSuffix}.csv`

      downloadCSV(filename, csvRows)
    } catch (err) {
      console.error("Export error:", err)
      alert("Something went wrong while exporting leads. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownToLineIcon className="w-4 h-4" />
        {isLoading ? "Exporting..." : `Export: ${eventId}`}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {showDropdown && !isLoading && (
        <div className="absolute top-full left-0 mt-1 bg-gray-900 text-gray-100 border border-gray-700 rounded shadow-lg z-50 min-w-[220px]">
          <button
            type="button"
            onClick={() => handleExportLeads("all")}
            className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors border-b border-gray-700"
          >
            Export All Registered
          </button>
          <button
            type="button"
            onClick={() => handleExportLeads("attended")}
            className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors border-b border-gray-700"
          >
            Export Attended Only
          </button>
          <button
            type="button"
            onClick={() => handleExportLeads("not_attended")}
            className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            Export Not Attended
          </button>
        </div>
      )}

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  )
}
