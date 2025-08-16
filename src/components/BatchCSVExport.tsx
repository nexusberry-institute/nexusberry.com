"use client"

import React, { useState } from "react"
import { MailIcon } from "lucide-react"

export const ExportAllBatchEmailsButton: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleExport = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/batches/export-all-batch-emails`, {
                credentials: 'include'
            })
            if (!res.ok) throw new Error(await res.text())

            const blob = await res.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `all_batches_emails_${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Export Data</h1>

            <div className="flex gap-4 flex-wrap mt-5">
                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="inline-flex items-center bg-blue-700 cursor-pointer gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <MailIcon size={16} />
                    {loading ? "Exporting..." : "Download All Registered Students Emails"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    )
}


