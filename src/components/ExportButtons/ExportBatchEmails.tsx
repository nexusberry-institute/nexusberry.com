"use client"
import { useState, useEffect } from "react"
import type { BeforeDocumentControlsClientProps } from "payload"

type BatchDataType = {
  name: string;
  mobile: string;
  email: string
}

export function ExportBatchEmails(props?: BeforeDocumentControlsClientProps) {
  const [batchId, setBatchId] = useState<string | undefined>("")
  const [batchData, setBatchData] = useState<BatchDataType | null>(null);

  const getLeadData = async () => {
  }

  useEffect(() => {
    const path = window.location.pathname
    const batchId = path.split("/").pop()
    setBatchId(batchId)
  }, [])

  return <button>Export Btch: {batchId}</button>
}