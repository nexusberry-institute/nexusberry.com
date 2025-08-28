"use client"
import { useState, useEffect } from "react"
import type { BeforeDocumentControlsClientProps } from "payload"
import { ArrowDownToLineIcon, ChevronDownIcon } from "lucide-react"

export function ExportCampaignLeads(props?: BeforeDocumentControlsClientProps) {
  const [campaignId, setCampaignId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const path = window.location.pathname
    const id = path.split("/").pop() || ""
    setCampaignId(id)
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

  // 🔹 Process leads data and create CSV
  function processLeadsData(leads: any[], attendanceFilter: 'all' | 'attended' | 'not_attended', campaignName: string) {
    const csvRows = ['"Name","Phone","Email","Gender","City","Province","Country","Event","Has Attended","Registration Date","UTM Source","UTM Campaign","UTM Medium"']
    
    const filteredLeads = leads.filter(lead => {
      if (!lead.eventAttendance || !Array.isArray(lead.eventAttendance)) return false
      
      // Check if any event attendance has this campaign
      const campaignAttendance = lead.eventAttendance.find((attendance: any) => {
        const attendanceCampaignId = typeof attendance.campaign === "object" ? attendance.campaign.id : attendance.campaign
        return attendanceCampaignId === campaignId
      })
      
      if (!campaignAttendance) return false
      
      if (attendanceFilter === 'attended') return campaignAttendance.hasAttended === true
      if (attendanceFilter === 'not_attended') return campaignAttendance.hasAttended !== true
      return true // 'all' case
    })

    filteredLeads.forEach(lead => {
      const name = lead.name || ""
      const phone = lead.mobile || ""
      const email = lead.email || ""
      const gender = lead.gender || ""
      const city = lead.city || ""
      const province = lead.province || ""
      const country = lead.country || ""
      
      // Find attendance record for this campaign
      const campaignAttendance = lead.eventAttendance?.find((attendance: any) => {
        const attendanceCampaignId = typeof attendance.campaign === "object" ? attendance.campaign.id : attendance.campaign
        return attendanceCampaignId === campaignId
      })
      
      const eventName = campaignAttendance?.event && typeof campaignAttendance.event === "object" 
        ? campaignAttendance.event.title || ""
        : ""
      const hasAttended = campaignAttendance?.hasAttended ? "Yes" : "No"
      const registrationDate = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""

      // Get UTM data from the campaign attendance or lead
      const campaign = campaignAttendance?.campaign
      const utmSource = campaign && typeof campaign === "object" ? campaign.utm_source || "" : ""
      const utmCampaign = campaign && typeof campaign === "object" ? campaign.utm_campaign || "" : ""
      const utmMedium = campaign && typeof campaign === "object" ? campaign.utm_medium || "" : ""

      // Escape quotes in CSV fields
      const safeName = name ? `"${name.replace(/"/g, '""')}"` : ""
      const safePhone = phone ? `"${phone.replace(/"/g, '""')}"` : ""
      const safeEmail = email ? `"${email.replace(/"/g, '""')}"` : ""
      const safeGender = gender ? `"${gender.replace(/"/g, '""')}"` : ""
      const safeCity = city ? `"${city.replace(/"/g, '""')}"` : ""
      const safeProvince = province ? `"${province.replace(/"/g, '""')}"` : ""
      const safeCountry = country ? `"${country.replace(/"/g, '""')}"` : ""
      const safeEvent = eventName ? `"${eventName.replace(/"/g, '""')}"` : ""
      const safeAttended = `"${hasAttended}"`
      const safeRegDate = `"${registrationDate}"`
      const safeUtmSource = utmSource ? `"${utmSource.replace(/"/g, '""')}"` : ""
      const safeUtmCampaign = utmCampaign ? `"${utmCampaign.replace(/"/g, '""')}"` : ""
      const safeUtmMedium = utmMedium ? `"${utmMedium.replace(/"/g, '""')}"` : ""

      csvRows.push(`${safeName},${safePhone},${safeEmail},${safeGender},${safeCity},${safeProvince},${safeCountry},${safeEvent},${safeAttended},${safeRegDate},${safeUtmSource},${safeUtmCampaign},${safeUtmMedium}`)
    })

    return { csvRows, count: filteredLeads.length }
  }

  const handleExportLeads = async (attendanceFilter: 'all' | 'attended' | 'not_attended') => {
    setIsLoading(true)
    setShowDropdown(false)

    try {
      // Fetch leads that came from this campaign
      const res = await fetch(
        `/api/leads?where[eventAttendance.campaign][equals]=${campaignId}&depth=3&limit=0`,
        {
          credentials: "include",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch leads")

      const data = await res.json()

      if (!data.docs || data.docs.length === 0) {
        alert("No leads found for this campaign.")
        return
      }

      // Get campaign name for filename
      const campaignRes = await fetch(`/api/campaigns/${campaignId}`, {
        credentials: "include",
      })
      const campaignData = await campaignRes.json()
      const campaignName = campaignData.name || "campaign"

      // Process data based on filter
      const { csvRows, count } = processLeadsData(data.docs, attendanceFilter, campaignName)

      if (count === 0) {
        const filterText = attendanceFilter === 'all' ? 'leads' : 
                          attendanceFilter === 'attended' ? 'attendees' : 'non-attendees'
        alert(`No ${filterText} found for this campaign.`)
        return
      }

      // Create filename based on filter
      const filterSuffix = attendanceFilter === 'all' ? 'all_leads' : 
                          attendanceFilter === 'attended' ? 'attended_leads' : 'not_attended_leads'
      const cleanCampaignName = campaignName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const filename = `campaign_${cleanCampaignName}_${filterSuffix}.csv`

      // Download CSV
      downloadCSV(filename, csvRows)
    } catch (err) {
      console.error("Export error:", err)
      alert("Something went wrong while exporting leads. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCampaignSummary = async () => {
    setIsLoading(true)
    setShowDropdown(false)

    try {
      // Get campaign details
      const campaignRes = await fetch(`/api/campaigns/${campaignId}?depth=2`, {
        credentials: "include",
      })
      const campaignData = await campaignRes.json()

      // Get leads for this campaign
      const leadsRes = await fetch(
        `/api/leads?where[eventAttendance.campaign][equals]=${campaignId}&depth=3&limit=0`,
        {
          credentials: "include",
        }
      )
      const leadsData = await leadsRes.json()

      const totalLeads = leadsData.docs?.length || 0
      const attendedCount = leadsData.docs?.filter((lead: any) => 
        lead.eventAttendance?.some((attendance: any) => {
          const attendanceCampaignId = typeof attendance.campaign === "object" ? attendance.campaign.id : attendance.campaign
          return attendanceCampaignId === campaignId && attendance.hasAttended === true
        })
      ).length || 0

      const csvRows = [
        '"Campaign Summary"',
        '"Metric","Value"',
        `"Campaign Name","${campaignData.name || ""}"`,
        `"Platform","${campaignData.platform || ""}"`,
        `"Start Date","${campaignData.startDate ? new Date(campaignData.startDate).toLocaleDateString() : ""}"`,
        `"End Date","${campaignData.endDate ? new Date(campaignData.endDate).toLocaleDateString() : ""}"`,
        `"Budget","${campaignData.budget || 0}"`,
        `"UTM Source","${campaignData.utm_source || ""}"`,
        `"UTM Campaign","${campaignData.utm_campaign || ""}"`,
        `"UTM Medium","${campaignData.utm_medium || ""}"`,
        `"Total Leads","${totalLeads}"`,
        `"Attended Events","${attendedCount}"`,
        `"Attendance Rate","${totalLeads > 0 ? ((attendedCount / totalLeads) * 100).toFixed(2) + '%' : '0%'}"`,
        "",
        '"Associated Events"',
        '"Event Title","Start Date"'
      ]

      // Add events to the summary
      if (campaignData.events && Array.isArray(campaignData.events)) {
        campaignData.events.forEach((event: any) => {
          const eventTitle = typeof event === "object" ? event.title || "" : ""
          const eventDate = typeof event === "object" && event.startDateTime 
            ? new Date(event.startDateTime).toLocaleDateString() 
            : ""
          csvRows.push(`"${eventTitle.replace(/"/g, '""')}","${eventDate}"`)
        })
      }

      const cleanCampaignName = campaignData.name?.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'campaign'
      const filename = `campaign_${cleanCampaignName}_summary.csv`

      downloadCSV(filename, csvRows)
    } catch (err) {
      console.error("Export error:", err)
      alert("Something went wrong while exporting campaign summary. Please try again.")
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
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowDownToLineIcon className="w-4 h-4" />
        {isLoading ? "Exporting..." : "Export Campaign Data"}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {showDropdown && !isLoading && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[220px]">
          <button
            type="button"
            onClick={handleExportCampaignSummary}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 font-medium text-purple-700"
          >
            Campaign Summary
          </button>
          <button
            type="button"
            onClick={() => handleExportLeads('all')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            All Campaign Leads
          </button>
          <button
            type="button"
            onClick={() => handleExportLeads('attended')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            Attended Events
          </button>
          <button
            type="button"
            onClick={() => handleExportLeads('not_attended')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            Did Not Attend
          </button>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
