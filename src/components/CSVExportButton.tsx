"use client"
import type React from "react"
import { useState } from "react"

export const CSVExportButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDownload = async () => {
        setIsLoading(true)
        setError(null)

        try {
            console.log("Attempting to fetch student data...")

            // First, test the basic students endpoint
            const testResponse = await fetch("/api/students", {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!testResponse.ok) {
                const text = await testResponse.text()
                console.error("Failed to fetch students:", text)
                throw new Error(`Failed to fetch students: ${testResponse.status}`)
            }

            const studentsData = await testResponse.json()
            console.log("Students data received:", studentsData)

            // Log student names for debugging
            if (studentsData.docs && studentsData.docs.length > 0) {
                console.log("First few student names:")
                studentsData.docs.slice(0, 1).forEach((student: any, index: number) => {
                    console.log(`${index + 1}. ${student.fullName || "No name"} (ID: ${student.id})`)
                })
            } else {
                console.warn("No students found in the response")
                throw new Error("No students found to export")
            }

            // Now try the CSV export with better error handling
            console.log("Now attempting CSV export...")
            const response = await fetch("/api/students/export-csv", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "text/csv, application/json",
                },
            })

            console.log("CSV export response status:", response.status)
            console.log("CSV export response headers:", Object.fromEntries(response.headers.entries()))

            if (!response.ok) {
                const contentType = response.headers.get("content-type")
                let errorText

                if (contentType && contentType.includes("application/json")) {
                    try {
                        const errorJson = await response.json()
                        errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson)

                        // If we have detailed error info in development
                        if (errorJson.details) {
                            console.error("Detailed error:", errorJson.details)
                        }
                    } catch (parseError) {
                        errorText = await response.text()
                    }
                } else {
                    errorText = await response.text()
                }

                console.error("CSV export failed:", errorText)
                throw new Error(`Export failed (${response.status}): ${errorText}`)
            }

            // Check if we actually got CSV content
            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("text/csv")) {
                console.warn("Response doesn't appear to be CSV:", contentType)
                // Try to read as text to see what we got
                const responseText = await response.text()
                console.log("Response content:", responseText)
                throw new Error("Server returned non-CSV content")
            }

            const blob = await response.blob()
            console.log("CSV blob size:", blob.size, "bytes")

            if (blob.size === 0) {
                throw new Error("Received empty CSV file")
            }

            // Create download link
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `students_names_${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)

            console.log("CSV download completed successfully")
        } catch (err: any) {
            console.error("Full error details:", {
                error: err,
                message: err.message,
                stack: err.stack,
            })
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleDownload}
                disabled={isLoading}
                className={`inline-flex items-center cursor-pointer gap-2 px-4 py-2 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
            >
                <span>📄</span>
                {isLoading ? "Exporting..." : "Download Names CSV"}
            </button>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    )
}