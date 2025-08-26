// import { checkAccess } from "@/access/accessControl";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";
import { format } from 'date-fns';

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "mobile",
    group: "Marketing & Outreach",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        /**
         * 1. Send confirmation email when user registers for an event
         */
        if (
          doc.events &&
          Array.isArray(doc.events) &&
          doc.events.length > 0 &&
          doc.email &&
          doc.name
        ) {
          try {
            // Always pick the most recently added event
            const latestEventId = doc.events[doc.events.length - 1];
            const eventId =
              typeof latestEventId === "object" ? latestEventId.id : latestEventId;

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
                    <h1>Hello, ${doc.name}</h1>
                    <p>Thank you for registering for the event: <strong>${event.title}</strong></p>
                    <p>📅 <strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>⏰ Time:</strong> ${startTime} ${
                endTime ? `- ${endTime}` : ""
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

        /**
         * 2. Update statistics (registrations + campaign visitors)
         *    in the related event(s) when new leads are linked
         */
        if (doc.events && Array.isArray(doc.events)) {
          try {
            const previousEvents = previousDoc?.events || [];
            const previousEventIds = previousEvents.map((e: any) =>
              typeof e === "object" ? e.id : e
            );
            const currentEventIds = doc.events.map((e: any) =>
              typeof e === "object" ? e.id : e
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
                  // Did this lead also get assigned to a new campaign?
                  const prevCampaigns = previousDoc?.campaigns || [];
                  const prevCampaignIds = prevCampaigns.map((c: any) =>
                    typeof c === "object" ? c.id : c
                  );
                  const currentCampaignIds = doc.campaigns?.map((c: any) =>
                    typeof c === "object" ? c.id : c
                  ) || [];

                  const newCampaignIds = currentCampaignIds.filter(
                    (id: any) => !prevCampaignIds.includes(id)
                  );

                  // Update event stats in ONE call
                  await req.payload.update({
                    collection: "events",
                    id: eventId,
                    data: {
                      actualRegistrations: (event.actualRegistrations || 0) + 1,
                      campaignVisitors:
                        (event.campaignVisitors || 0) +
                        (newCampaignIds.length > 0 ? 1 : 0),
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
            "LOW",
            "MEDIUM",
            "HIGH",
            "UNKNOWN"
          ]
        },
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
          name: "events",
          type: "relationship",
          relationTo: "events",
          hasMany: true,
          label: "Registered Events",
        },
        {
          name: "campaigns",
          type: "relationship",
          relationTo: "campaigns",
          hasMany: true,
          required: false,
          label: "Campaign Sources",
        },
        {
          name: "assign_to",
          type: "relationship",
          relationTo: "staffs",
          hasMany: false
        },
      ]
    },
    // Legacy fields for data migration (will be removed after migration)
    {
      type: "row",
      fields: [
        {
          name: "event",
          type: "relationship",
          relationTo: "events",
          hasMany: false,
          label: "Legacy Event (Migration Only)",
          admin: {
            condition: () => false, // Hide from admin UI
          }
        },
        {
          name: "campaign",
          type: "relationship",
          relationTo: "campaigns",
          hasMany: false,
          label: "Legacy Campaign (Migration Only)",
          admin: {
            condition: () => false, // Hide from admin UI
          }
        },
        {
          name: "has_attended",
          type: "checkbox",
          label: "Legacy Attendance (Migration Only)",
          admin: {
            condition: () => false, // Hide from admin UI
          }
        }
      ]
    },
    {
      name: "eventAttendance",
      type: "array",
      label: "Event Attendance Tracking",
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
              name: "hasAttended",
              type: "checkbox",
              defaultValue: false,
              label: "Has Attended",
            },
            {
              name: "campaign",
              type: "relationship",
              relationTo: "campaigns",
              required: false,
              label: "Registration Campaign",
            }
          ]
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