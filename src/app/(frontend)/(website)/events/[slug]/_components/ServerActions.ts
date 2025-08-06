'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
interface FormData {
  email: string,
  phoneNumber: string,
  name: string,
  events: number
}

export default async function CreateEventRegistration(data: FormData) {

  try {
    const payload = await getPayload({ config })

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

      const checkExistingEvent = checkExistingRegistration.docs[0]
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
        await payload.update({
          collection: "event-registrations",
          id: checkExistingRegistration.docs[0].id,
          data: {
            registeredEvents: [
              {
                event: data.events
              },
              ...(checkExistingRegistration.docs[0].registeredEvents
                .map(regEvent => typeof regEvent.event === 'object' ?
                  { event: regEvent.event.id } : { event: regEvent.event }))
            ]
          }
        })
        return {
          success: true,
          message: "Your registration has been completed.",
          error: null
        }
      }
    }

    await payload.create({
      collection: 'event-registrations',
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: data.name,
        registeredEvents: [{
          event: data.events
        }]
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
