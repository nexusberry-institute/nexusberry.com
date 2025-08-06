"use server"
import { getPayload } from "payload";
import config from '@payload-config';

export const markParticipantAttendance = async (eventId: number, applicant: any) => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'event-registrations',
      where: {
        phoneNumber: {
          equals: applicant.phoneNumber,
        }
      },
      pagination: false,
      depth: 0,
      limit: 1,
    })

    if (docs[0]) {
      const currentEventRegistration = docs[0].registeredEvents.find((regEvent) => regEvent.event === eventId);

      if (!currentEventRegistration) {
        return { success: false, refresh: false }  // should register first
      }

      if (currentEventRegistration.hasAttended === false) {
        await payload.update({
          collection: 'event-registrations',
          id: docs[0].id,
          data: {
            registeredEvents: [
              {
                ...currentEventRegistration, hasAttended: true,
              },
              ...docs[0].registeredEvents.filter(regEvent => regEvent.event !== eventId)
            ]
          }
        })
      } //only mark once and allow to join meeting

      return { success: true, refresh: false } //already marked, allowed to join

    }

    return { success: false, refresh: true } //refresh page to fetch again

  } catch (error) {
    console.error("Error marking participant attendance:", error);
    return { success: false, refresh: true };
  }
}