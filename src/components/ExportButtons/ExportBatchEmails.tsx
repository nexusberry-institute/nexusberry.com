"use client"
import { useState, useEffect } from "react"
import type { BeforeDocumentControlsClientProps } from "payload"

export function ExportBatchEmails(props?: BeforeDocumentControlsClientProps) {
  const [batchId, setBatchId] = useState<string | undefined>("")

  useEffect(() => {
    const path = window.location.pathname
    const batchId = path.split("/").pop()
    setBatchId(batchId)
  }, [])

  return <div>Export Emails: {batchId}</div>
}
