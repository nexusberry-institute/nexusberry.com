"use client"
import type React from "react"
import { useState } from "react"
import { FileTextIcon, MailIcon, PhoneIcon } from "lucide-react"


export const CSVExportButton: React.FC = () => {
    const [isLoadingNames, setIsLoadingNames] = useState(false)
    const [isLoadingEmails, setIsLoadingEmails] = useState(false)
    const [isLoadingMobiles, setIsLoadingMobiles] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDownloadNames = async () => {
        setIsLoadingNames(true)
        setError(null)

        try {
            const response = await fetch("/api/students/export-csv", {
                method: "GET",
                credentials: "include",
                headers: { Accept: "text/csv, application/json" },
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const blob = await response.blob()
            if (blob.size === 0) throw new Error("Empty CSV file received")

            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `students_names_${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoadingNames(false)
        }
    }

    const handleDownloadEmails = async () => {
        setIsLoadingEmails(true)
        setError(null)

        try {
            const response = await fetch("/api/students/export-emails", {
                method: "GET",
                credentials: "include",
                headers: { Accept: "text/csv, application/json" },
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const blob = await response.blob()
            if (blob.size === 0) throw new Error("Empty CSV file received")

            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `students_emails_${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoadingEmails(false)
        }
    }

    // const handleDownloadMobiles = async () => {
    //     setIsLoadingMobiles(true)
    //     setError(null)

    //     try {
    //         const response = await fetch("/api/students/export-mobiles", {
    //             method: "GET",
    //             credentials: "include",
    //             headers: { Accept: "text/csv, application/json" },
    //         })

    //         if (!response.ok) {
    //             throw new Error(await response.text())
    //         }

    //         const blob = await response.blob()
    //         if (blob.size === 0) throw new Error("Empty CSV file received")

    //         const link = document.createElement("a")
    //         link.href = URL.createObjectURL(blob)
    //         link.download = `students_mobiles_${new Date().toISOString().split("T")[0]}.csv`
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link)
    //         URL.revokeObjectURL(link.href)
    //     } catch (err: any) {
    //         setError(err.message)
    //     } finally {
    //         setIsLoadingMobiles(false)
    //     }
    // }




    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Export Data</h1>

            <div className="flex gap-4 flex-wrap mt-5">
                <button
                    onClick={handleDownloadNames}
                    disabled={isLoadingNames}
                    className={`inline-flex items-center bg-blue-700 cursor-pointer gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingNames ? "bg-primary cursor-allowed text-white" : "bg-primary-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <FileTextIcon className="w-4 h-4" />
                    {isLoadingNames ? "Exporting..." : "Download Names CSV"}
                </button>

                <button
                    onClick={handleDownloadEmails}
                    disabled={isLoadingEmails}
                    className={`inline-flex items-center bg-blue-700 cursor-pointer gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingEmails ? "bg-primary cursor-allowed text-white" : "bg-primary-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <MailIcon className="w-4 h-4" />
                    {isLoadingEmails ? "Exporting..." : "Download Emails CSV"}
                </button>

                {/* <button
                    onClick={handleDownloadMobiles}
                    disabled={isLoadingMobiles}
                    className={`inline-flex items-center bg-blue-700 cursor-pointer gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingMobiles ? "bg-primary cursor-allowed text-white" : "bg-primary-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    <PhoneIcon className="w-4 h-4" />
                    {isLoadingMobiles ? "Exporting..." : "Download Mobile CSV"}
                </button> */}
            </div>

            {error && (
                <div className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    )
}