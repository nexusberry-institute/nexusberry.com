"use server"
import { getPayload } from "payload";
import config from '@payload-config';

export const markParticipantAttendance = async (eventId: number, applicant: any) => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'leads',
      where: {
        mobile: {
          equals: applicant.phoneNumber,
        }
      },
      pagination: false,
      depth: 0,
      limit: 1,
    })

    if (docs[0]) {
      const currentEventAttendance = docs[0].eventAttendance?.find((attendance) => {
        const attendanceEventId = typeof attendance.event === 'object' ? attendance.event.id : attendance.event;
        return attendanceEventId === eventId;
      });

      if (!currentEventAttendance) {
        return { success: false, refresh: false }  // should register first
      }

      if (currentEventAttendance.hasAttended === false) {
        // Update the specific attendance record
        const updatedAttendance = docs[0].eventAttendance?.map((attendance) => {
          const attendanceEventId = typeof attendance.event === 'object' ? attendance.event.id : attendance.event;
          if (attendanceEventId === eventId) {
            return { ...attendance, hasAttended: true };
          }
          return attendance;
        });

        await payload.update({
          collection: 'leads',
          id: docs[0].id,
          data: {
            eventAttendance: updatedAttendance
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