import type { CollectionAfterChangeHook } from 'payload';

// Update statistics (registrations + campaign visitors)
// in the related event(s) when new leads are linked
export const updateCounters: CollectionAfterChangeHook =
  async ({ doc, req, operation, previousDoc }) => {
    if (operation !== "create") return
    if (
      !doc.eventAttendance ||
      !Array.isArray(doc.eventAttendance) ||
      doc.eventAttendance.length == 0
    ) return

    try {
      const previousAttendance = previousDoc?.eventAttendance || [];
      const previousEventIds = previousAttendance.map((a: any) =>
        typeof a.event === "object" ? a.event.id : a.event
      );
      const currentEventIds = doc.eventAttendance.map((a: any) =>
        typeof a.event === "object" ? a.event.id : a.event
      );

      // Find only newly-added events
      const newEventIds = currentEventIds.filter(
        (id: any) => !previousEventIds.includes(id)
      );

      for (const eventId of newEventIds) {
        try {
          const event = await req.payload.findByID({
            collection: "events",
            id: eventId,
          });

          if (event) {
            // Find the attendance record for this event to check if it has a campaign
            const attendanceRecord = doc.eventAttendance.find((a: any) => {
              const aEventId = typeof a.event === "object" ? a.event.id : a.event;
              return aEventId === eventId;
            });

            const hasCampaign = attendanceRecord?.campaign ? 1 : 0;

            // Update event stats in ONE call
            await req.payload.update({
              collection: "events",
              id: eventId,
              data: {
                totalRegistrations: (event.totalRegistrations || 0) + 1,
                campaignRegistrations: (event.campaignRegistrations || 0) + hasCampaign,
              },
            });
          }
        } catch (error) {
          console.warn(
            `Failed to update statistics for event ${eventId}:`,
            error
          );
        }
      }
    } catch (error) {
      console.warn("Failed to update event/campaign statistics:", error);
    }
  }