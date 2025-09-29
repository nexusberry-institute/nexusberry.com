import type { CollectionAfterChangeHook } from 'payload';
import { format } from 'date-fns';

// Send confirmation email when user registers for an event
export const emailOnEventRegistration: CollectionAfterChangeHook =
  async ({ doc, req, operation }) => {
    if (operation !== "create" || !doc.email) return
    if (
      !doc.eventAttendance ||
      !Array.isArray(doc.eventAttendance) ||
      doc.eventAttendance.length == 0
    ) return

    try {
      // Always pick the most recently added event
      const latestAttendance = doc.eventAttendance[doc.eventAttendance.length - 1];
      const eventId = typeof latestAttendance.event === "object" ? latestAttendance.event.id : latestAttendance.event;

      const event = await req.payload.findByID({
        collection: "events",
        id: eventId,
      });

      if (event && event.startDateTime) {
        const formattedDate = format(
          new Date(event.startDateTime),
          "do MMMM yyyy, EEEE"
        );
        const startTime = format(
          new Date(event.startDateTime),
          "hh:mm a"
        );
        const endTime = event.endTime
          ? format(new Date(event.endTime), "hh:mm a")
          : "";

        await req.payload.sendEmail({
          to: doc.email,
          subject: "Event Registration Confirmation",
          html: `<div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
              <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h1>Hello, ${doc.name || 'Participant'}</h1>
                <p>Thank you for registering for the event: <strong>${event.title}</strong></p>
                <p>📅 <strong>Date:</strong> ${formattedDate}</p>
                <p><strong>⏰ Time:</strong> ${startTime} ${endTime ? `- ${endTime}` : ""
            } IST</p>
                <p>We look forward to seeing you!</p>
              </div>
            </div>`,
        });
      }
    } catch (error) {
      console.warn("Failed to send event registration email:", error);
    }
  }