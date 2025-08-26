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
        const found = await (payload as any).find({
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

      const existing = checkExistingLead.docs[0]
      // check if this lead already has this event assigned (we'll use lead.event field if present)
      const hasEvent = !!existing.event && ((typeof existing.event === 'object' && existing.event.id === data.events) || existing.event === data.events)

      if (hasEvent) {
        return {
          success: false,
          message: null,
          error: "You have already registered for this event."
        }
      } else {
        // update existing lead: set event relation and campaign if missing
        const updatePayload: any = {
          event: data.events,
          email: data.email,
          name: data.name,
          mobile: data.phoneNumber,
        }
  if (campaignRecord && !(existing as any).campaign) updatePayload.campaign = campaignRecord.id

        await payload.update({
          collection: 'leads',
          id: checkExistingLead.docs[0].id,
          data: updatePayload,
        })

        // increment actualRegistrations for this event
        try {
          const ev = await (payload as any).findByID({ collection: 'events', id: data.events as any }).catch(() => null)
          const newCount = (ev?.actualRegistrations ?? 0) + 1
          await (payload as any).update({ collection: 'events', id: data.events as any, data: { actualRegistrations: newCount } })
        } catch (e) {
          console.warn('Failed to increment actualRegistrations (lead update branch)', e)
        }

        if (campaignRecord) {
          try {
            await (payload as any).update({ collection: 'campaigns', id: campaignRecord.id as any, data: { visitorCount: (campaignRecord.visitorCount || 0) + 1 } })
          } catch (e) {
            console.warn('Failed to increment campaign.visitorCount (lead update branch)', e)
          }
        }

        return { success: true, message: 'Your registration has been completed.', error: null }
      }
    }

    // Create new lead (attach campaign if found)
    await payload.create({
      collection: 'leads',
      data: {
        name: data.name,
        email: data.email,
        mobile: data.phoneNumber,
        event: data.events,
        ...(campaignRecord ? { campaign: campaignRecord.id } : {}),
      }
    })

    // increment actualRegistrations for the event (create branch)
    try {
      const ev = await (payload as any).findByID({ collection: 'events', id: data.events as any }).catch(() => null)
      const newCount = (ev?.actualRegistrations ?? 0) + 1
      await (payload as any).update({
        collection: 'events',
        id: data.events as any,
        data: { actualRegistrations: newCount }
      })
    } catch (e) {
      console.warn('Failed to increment actualRegistrations (create branch)', e)
    }

    // increment campaign visitorCount for conversions (create branch)
    if (campaignRecord) {
      try {
        await (payload as any).update({
          collection: 'campaigns',
          id: campaignRecord.id as any,
          data: { visitorCount: (campaignRecord.visitorCount || 0) + 1 }
        })
      } catch (e) {
        console.warn('Failed to increment campaign.visitorCount (create branch)', e)
      }
    }

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