'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

interface FormData {
  email: string,
  phoneNumber: string,
  name: string,
  events: number,
  utm?: string // Legacy UTM field
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
  utm_content?: string
}

export default async function CreateEventRegistration(data: FormData) {
  try {
    const payload = await getPayload({ config })

    // find campaign by utm parameters if provided
    let campaignRecord: any = null
    try {
      if (data.utm || data.utm_source || data.utm_campaign || data.utm_medium || data.utm_content) {
        // Try to find campaign by matching any of the UTM parameters
        const whereConditions: any = {
          or: []
        }
        
        // Add conditions for each UTM parameter that exists
        if (data.utm) {
          whereConditions.or.push({ utm: { equals: data.utm } })
        }
        if (data.utm_source) {
          whereConditions.or.push({ utm_source: { equals: data.utm_source } })
        }
        if (data.utm_campaign) {
          whereConditions.or.push({ utm_campaign: { equals: data.utm_campaign } })
        }
        if (data.utm_medium) {
          whereConditions.or.push({ utm_medium: { equals: data.utm_medium } })
        }
        if (data.utm_content) {
          whereConditions.or.push({ utm_content: { equals: data.utm_content } })
        }
        
        const found = await payload.find({
          collection: 'campaigns',
          where: whereConditions,
          limit: 1,
          pagination: false,
        })
        campaignRecord = found?.docs?.[0] ?? null
        
        // If no specific campaign found but UTM params exist, create a "General UTM" campaign
        if (!campaignRecord && (data.utm || data.utm_source || data.utm_campaign || data.utm_medium || data.utm_content)) {
          try {
            // Check if "General UTM" campaign already exists
            const generalCampaign = await payload.find({
              collection: 'campaigns',
              where: { name: { equals: 'General UTM Traffic' } },
              limit: 1,
              pagination: false,
            })
            
            if (generalCampaign?.docs?.[0]) {
              campaignRecord = generalCampaign.docs[0]
            } else {
              // Create "General UTM" campaign
              campaignRecord = await payload.create({
                collection: 'campaigns',
                data: {
                  name: 'General UTM Traffic',
                  platform: 'Mixed',
                  utm_source: data.utm_source || 'unknown',
                  utm_campaign: data.utm_campaign || 'general',
                  utm_medium: data.utm_medium || 'unknown',
                  utm_content: data.utm_content || 'unknown',
                  utm: data.utm || 'general-utm',
                }
              })
            }
          } catch (e) {
            console.warn('Failed to create General UTM campaign:', e)
            campaignRecord = null
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
      const existing = checkExistingLead.docs[0] as any;
      
      // Check if this lead already has this event in their eventAttendance array
      const existingAttendance = existing.eventAttendance || [];
      const hasEvent = existingAttendance.some((attendance: any) => {
        const eventId = typeof attendance.event === 'object' ? attendance.event.id : attendance.event;
        return eventId === data.events;
      });

      if (hasEvent) {
        return {
          success: false,
          message: null,
          error: "You have already registered for this event."
        }
      } else {
        // Add new event to the eventAttendance array
        const newAttendance = {
          event: data.events,
          hasAttended: false,
          ...(campaignRecord ? { campaign: campaignRecord.id } : {})
        };

        await payload.update({
          collection: 'leads',
          id: checkExistingLead.docs[0].id,
          data: {
            eventAttendance: [...existingAttendance, newAttendance]
          },
        })

        return { success: true, message: 'Your registration has been completed.', error: null, redirectTo: '/registration-success' }
      }
    }

    // Create new lead with eventAttendance array
    // The hooks in Leads collection will handle: 
    // - Event statistics update
    // - Campaign statistics update  
    // - Email sending
    const eventAttendanceRecord = {
      event: data.events,
      hasAttended: false,
      ...(campaignRecord ? { campaign: campaignRecord.id } : {})
    };

    await payload.create({
      collection: 'leads',
      data: {
        name: data.name,
        email: data.email,
        mobile: data.phoneNumber,
        eventAttendance: [eventAttendanceRecord]
      }
    })

    return {
      success: true,
      message: "Your registration has been completed.",
      error: null,
      redirectTo: '/registration-success'
    }
  } catch (error) {
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : error
    }
  }
}