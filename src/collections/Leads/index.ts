import { CollectionConfig } from "payload";
// import { checkAccess } from "@/access/accessControl";
// import { format } from 'date-fns';
import {
  trackLeadSubmission,
  trackLeadEventAttendance,
  trackInterestedLead,
} from "@/hooks/track/trackingHooks";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "mobile",
    group: "Marketing & Outreach",
  },
  hooks: {
    afterChange: [
      trackLeadSubmission,
      async ({ doc, req, operation, previousDoc }) => {
        /**
         * 1. Send confirmation email when user registers for an event
         */
        // if (
        //   doc.eventAttendance &&
        //   Array.isArray(doc.eventAttendance) &&
        //   doc.eventAttendance.length > 0 &&
        //   doc.email &&
        //   doc.name
        // ) {
        //   try {
        //     // Always pick the most recently added event
        //     const latestAttendance = doc.eventAttendance[doc.eventAttendance.length - 1];
        //     const eventId = typeof latestAttendance.event === "object" ? latestAttendance.event.id : latestAttendance.event;

        //     const event = await req.payload.findByID({
        //       collection: "events",
        //       id: eventId,
        //     });

        //     if (event && event.startDateTime) {
        //       const formattedDate = format(
        //         new Date(event.startDateTime),
        //         "do MMMM yyyy, EEEE"
        //       );
        //       const startTime = format(
        //         new Date(event.startDateTime),
        //         "hh:mm a"
        //       );
        //       const endTime = event.endTime
        //         ? format(new Date(event.endTime), "hh:mm a")
        //         : "";

        //       await req.payload.sendEmail({
        //         to: doc.email,
        //         subject: "Event Registration Confirmation",
        //         html: `<div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
        //           <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        //             <h1>Hello, ${doc.name}</h1>
        //             <p>Thank you for registering for the event: <strong>${event.title}</strong></p>
        //             <p>📅 <strong>Date:</strong> ${formattedDate}</p>
        //             <p><strong>⏰ Time:</strong> ${startTime} ${
        //         endTime ? `- ${endTime}` : ""
        //       } IST</p>
        //             <p>We look forward to seeing you!</p>
        //           </div>
        //         </div>`,
        //       });
        //     }
        //   } catch (error) {
        //     console.warn("Failed to send event registration email:", error);
        //   }
        // }

        /**
         * 2. Update statistics (registrations + campaign visitors)
         *    in the related event(s) when new leads are linked
         */
        if (doc.eventAttendance && Array.isArray(doc.eventAttendance)) {
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
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "mobile",
          type: "text",
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email"
        },
        {
          name: "gender",
          type: "select",
          options: [
            {
              label: "Male",
              value: "MALE",
            },
            {
              label: "Female",
              value: "FEMALE",
            }
          ]
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "area",
          type: "text"
        },
        {
          name: "city",
          type: "text",
        },
        {
          name: "province",
          type: "text",
        },
        {
          name: "country",
          type: "text",
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "is_online",
          type: "checkbox",
        },
        {
          name: "is_req_hostel",
          type: "checkbox",
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "stage",
          type: "select",
          options: [
            {
              label: "New",
              value: "NEW",
            },
            {
              label: "Follow Up",
              value: "FOLLOW_UP",
            },
            {
              label: "Converted",
              value: "CONVERTED",
            },
            {
              label: "Waste",
              value: "WASTE",
            },
          ]
        },
        {
          name: "interest_level",
          type: "select",
          options: [
            { label: "Low", value: "LOW" },
            { label: "Medium", value: "MEDIUM" },
            { label: "High", value: "HIGH" },
            { label: "Unknown", value: "UNKNOWN" },
          ],
          hooks: {
            afterChange: [trackInterestedLead]
          }
        }
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "education",
          type: "text",
        },
        {
          name: "job_info",
          type: "text"
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "student",
          type: "relationship",
          relationTo: "students",
        },
        {
          name: "module",
          type: "relationship",
          relationTo: "modules",
        },
        {
          name: "department",
          type: "relationship",
          relationTo: "departments",
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "reminder_date",
          type: "date",
        },
        {
          name: "reminder_note",
          type: "textarea",
        },
        {
          name: "not_responding",
          label: "Not Responding",
          type: "checkbox"
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "assign_to",
          type: "relationship",
          relationTo: "staffs",
          hasMany: false
        },
      ]
    },
    // Legacy fields for data migration (will be removed after migration)
    // {
    //   type: "row",
    //   fields: [
    //     {
    //       name: "event",
    //       type: "relationship",
    //       relationTo: "events",
    //       hasMany: false,
    //       label: "Legacy Event (Migration Only)",
    //       admin: {
    //         condition: () => false, // Hide from admin UI
    //       }
    //     },
    //     {
    //       name: "campaign",
    //       type: "relationship",
    //       relationTo: "campaigns",
    //       hasMany: false,
    //       label: "Legacy Campaign (Migration Only)",
    //       admin: {
    //         condition: () => false, // Hide from admin UI
    //       }
    //     },
    //     {
    //       name: "has_attended",
    //       type: "checkbox",
    //       label: "Legacy Attendance (Migration Only)",
    //       admin: {
    //         condition: () => false, // Hide from admin UI
    //       }
    //     }
    //   ]
    // },
    {
      name: "courseDemoBookings",
      type: "array",
      label: "Course Demo Bookings",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "course",
              type: "relationship",
              relationTo: "courses-collection",
              required: true,
              hasMany: false,
            },
            {
              name: "bookedAt",
              type: "date",
              required: true,
              label: "Booked At",
            }
          ]
        }
      ]
    },
    {
      name: "eventAttendance", // rename registrations later
      type: "array",
      label: "Event Registrations",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "event",
              type: "relationship",
              relationTo: "events",
              required: true,
              hasMany: false,
            },
            {
              name: "campaign",
              type: "relationship",
              relationTo: "campaigns",
              required: false,
              label: "Registration Campaign",
            }
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "source",
              type: "text",
            },
            {
              name: "registeredAt",
              type: "date",
            }
          ],
        },
        {
          name: "hasAttended",
          type: "checkbox",
          defaultValue: false,
          label: "Has Attended",
          hooks: {
            afterChange: [trackLeadEventAttendance()]
          }
        }
      ]
    },
    {
      name: "payment_plan",
      type: "text",
    },
    {
      name: "source",
      type: "text",
    },
    {
      name: "query",
      type: "textarea",
    },
    {
      name: "lead_issue",
      type: "textarea",
    },
    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "activity",
      type: "json",
    },
    {
      name: "lead_engagement",
      type: "json"
    }
  ],
};