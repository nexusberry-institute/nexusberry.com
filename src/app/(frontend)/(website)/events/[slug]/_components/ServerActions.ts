'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

interface FormData {
  email: string,
  phoneNumber: string,
  name: string,
  events: number,
  utm?: string // optional UTM/campaign code from frontend
}

export default async function CreateEventRegistration(data: FormData) {
  try {
    const payload = await getPayload({ config })

    // find campaign by utm if provided
    let campaignRecord: any = null
    try {
      if (data.utm) {
        const found = await payload.find({
          collection: 'campaigns',
          where: { utm: { equals: data.utm } },
          limit: 1,
          pagination: false,
        })
        campaignRecord = found?.docs?.[0] ?? null
        // if utm was provided but no campaign exists, reject the registration
        if (!campaignRecord) {
          return {
            success: false,
            message: null,
            error: 'Invalid campaign UTM provided.'
          }
        }
      }
    } catch (e) {
      console.warn('Campaign lookup failed', e)
      campaignRecord = null
    }

    // check existing lead by mobile (phone number)
    const checkExistingLead = await payload.find({
      collection: 'leads',
      where: {
        mobile: {
          equals: data.phoneNumber
        },
      },
      depth: 1
    })

    if (checkExistingLead.docs[0]) {
      const existing = checkExistingLead.docs[0] as any; // Cast to any to access new fields
      
      // Check if this lead already has this event assigned (events is now an array)
      const existingEvents = existing.events || [];
      const existingEventIds = existingEvents.map((e: any) => typeof e === 'object' ? e.id : e);
      const hasEvent = existingEventIds.includes(data.events);

      if (hasEvent) {
        return {
          success: false,
          message: null,
          error: "You have already registered for this event."
        }
      } else {
        // update existing lead: add new event to the events array and campaign if missing
        const existingCampaigns = existing.campaigns || [];
        const updatePayload: any = {
          events: [...existingEventIds, data.events], // Add new event to existing events
        }
        
        // Only add campaign if the lead doesn't already have it and a campaign was provided
        if (campaignRecord) {
          const existingCampaignIds = existingCampaigns.map((c: any) => typeof c === 'object' ? c.id : c);
          if (!existingCampaignIds.includes(campaignRecord.id)) {
            updatePayload.campaigns = [...existingCampaignIds, campaignRecord.id];
          }
        }

        await payload.update({
          collection: 'leads',
          id: checkExistingLead.docs[0].id,
          data: updatePayload,
        })

        return { success: true, message: 'Your registration has been completed.', error: null }
      }
    }

    // Create new lead (attach campaign if found)
    // The hooks in Leads collection will handle: 
    // - Event statistics update
    // - Campaign statistics update  
    // - Email sending
    await payload.create({
      collection: 'leads',
      data: {
        name: data.name,
        email: data.email,
        mobile: data.phoneNumber,
        events: [data.events] as any, // Use array for multiple events
        ...(campaignRecord ? { campaigns: [campaignRecord.id] as any } : {}), // Use array for multiple campaigns
      }
    })

    return {
      success: true,
      message: "Your registration has been completed.",
      error: null
    }
  } catch (error) {
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : error
    }
  }
}