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

    const checkExistingRegistration = await payload.find({
      collection: 'event-registrations',
      where: {
        phoneNumber: {
          equals: data.phoneNumber
        },
      },
      depth: 1
    })

    if (checkExistingRegistration.docs[0]) {

      const existing = checkExistingRegistration.docs[0]
      const checkExistingEvent = existing
        .registeredEvents.filter(regEvent => typeof regEvent.event === 'object' ?
          regEvent.event.id === data.events : regEvent.event === data.events).length > 0

      if (checkExistingEvent) {
        return {
          success: false,
          message: null,
          error: "You have already registered for this event."
        }
      }
      else {
        // Update existing registration: add event and optionally campaign
        // build registeredEvents array without duplicates
        const existingEvents = (checkExistingRegistration.docs[0].registeredEvents || []).map((r: any) => (typeof r.event === 'object' ? r.event.id : r.event))
        const mergedEvents = [data.events, ...existingEvents.filter((id: any) => id !== data.events)].map((id: any) => ({ event: id }))

        const updatePayload: any = {
          registeredEvents: mergedEvents,
        }
        // only set campaign if registration has no campaign yet and campaignRecord exists
        if (campaignRecord && !checkExistingRegistration.docs[0].campaign) {
          updatePayload.campaign = campaignRecord.id
        }

        await payload.update({
          collection: "event-registrations",
          id: checkExistingRegistration.docs[0].id,
          data: updatePayload,
        })

        // increment actualRegistrations for this event (only once, because we ensured not previously registered)
        try {
          await (payload as any).update({
            collection: 'events',
            id: data.events as any,
            data: {
              actualRegistrations: (await (async () => {
                const ev = await (payload as any).findByID({ collection: 'events', id: data.events as any }).catch(() => null)
                return (ev?.actualRegistrations ?? 0) + 1
              })())
            },
          })
        } catch (e) {
          console.warn('Failed to increment actualRegistrations (update branch)', e)
        }

        // optionally increment campaign visitorCount for conversions
        if (campaignRecord) {
          try {
            await (payload as any).update({
              collection: 'campaigns',
              id: campaignRecord.id as any,
              data: { visitorCount: (campaignRecord.visitorCount || 0) + 1 }
            })
          } catch (e) {
            console.warn('Failed to increment campaign.visitorCount (update branch)', e)
          }
        }

        return {
          success: true,
          message: "Your registration has been completed.",
          error: null
        }
      }
    }

    // Create new registration (attach campaign if found)
    await payload.create({
      collection: 'event-registrations',
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: data.name,
        registeredEvents: [{
          event: data.events
        }],
        ...(campaignRecord ? { campaign: campaignRecord.id } : {})
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