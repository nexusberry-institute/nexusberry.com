"use client"
import { useState, useEffect } from "react"
import type { BeforeDocumentControlsClientProps } from "payload"
import { ArrowDownToLineIcon } from "lucide-react"

export function ExportBatchContacts(props?: BeforeDocumentControlsClientProps) {
  const [batchId, setBatchId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    const id = path.split("/").pop() || ""
    setBatchId(id)
  }, [])

  // 🔹 Helper function to download CSV
  function downloadCSV(filename: string, rows: string[]) {
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportBatchContacts = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)

    try {
      // Direct Payload API request
      const res = await fetch(
        `/api/enrollments?where[batchEnrollments.batch][equals]=${batchId}&depth=2&limit=0`,
        {
          credentials: "include",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch enrollments")

      const data = await res.json()

      // Store unique contacts
      const contacts = new Set<string>()

      for (const enrollment of data.docs) {
        let name = ""
        let email = ""
        let phone = ""

        if (enrollment.student && typeof enrollment.student === "object") {
          name =
            enrollment.student?.fullName ||
            enrollment.student?.name ||
            enrollment.student?.user?.name ||
            ""
          email = enrollment.student?.user?.email || ""
          phone = enrollment.student?.phoneNumber || enrollment.student?.user?.phoneNumber || ""
        }

        if (name || email || phone) {
          contacts.add(`${name},${phone},${email}`)
        }
      }

      if (contacts.size === 0) {
        alert("No contacts found for this batch.")
        return
      }

      // Make CSV
      const csvRows = ['"Name","Phone Number","Email"']
      contacts.forEach((row) => {
        const [name, phone, email] = row.split(",")

        const safeName = name ? `"${name.replace(/"/g, '""')}"` : ""
        const phoneSafe = phone ? `\t${phone}` : ""
        const safeEmail = email ? `"${email.replace(/"/g, '""')}"` : ""

        csvRows.push(`${safeName},"${phoneSafe}",${safeEmail}`)
      })

      // Download CSV
      downloadCSV(`batch_${batchId}_contacts.csv`, csvRows)
    } catch (err) {
      console.error("Export error:", err)
      alert("Something went wrong while exporting contacts. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleExportBatchContacts}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownToLineIcon className="w-4 h-4" />
        {isLoading ? "Exporting..." : "Export: " + batchId}
      </button>
    </div>
  )
}
