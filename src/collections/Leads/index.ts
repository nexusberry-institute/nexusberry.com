import { CollectionConfig } from "payload";
// import { checkAccess } from "@/access/accessControl";
// import { emailOnEventRegistration } from './hooks/email'
import { updateCounters } from './hooks/counters'
import {
  trackLeadSubmission,
  trackLeadEventAttendance,
} from "./hooks/track";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "mobile",
    group: "Marketing & Outreach",
  },
  hooks: {
    afterChange: [
      trackLeadSubmission,
      updateCounters,
      // emailOnEventRegistration,
    ],
  },
  fields: [
    // ===== SIDEBAR FIELDS =====
    {
      name: "course",
      type: "text",
      label: "Course",
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "stage",
      type: "select",
      options: [
        { label: "New", value: "NEW" },
        { label: "Follow Up", value: "FOLLOW_UP" },
        { label: "Converted", value: "CONVERTED" },
        { label: "Waste", value: "WASTE" },
        { label: "QUALIFIED", value: "QUALIFIED" },
        { label: "NOT_QUALIFIED", value: "NOT_QUALIFIED" },
        { label: "NEGOTIATION", value: "NEGOTIATION" },
        { label: "ENROLLED", value: "ENROLLED" },
        { label: "LOST", value: "LOST" },
      ],
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "label",
      type: "text",
      label: "Label",
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "notes",
      type: "textarea",
      label: "Staff Notes",
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "reminder_date",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        }
      }
    },
    {
      name: "assign_to",
      type: "relationship",
      relationTo: "staffs",
      hasMany: false,
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "not_responding",
      label: "Not Responding",
      type: "checkbox",
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "is_online",
      type: "checkbox",
      label: "Prefers Online",
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "is_req_hostel",
      type: "checkbox",
      label: "Requires Hostel",
      admin: {
        position: "sidebar",
      }
    },

    // ===== MAIN CONTENT WITH TABS =====
    {
      type: "tabs",
      tabs: [
        // ----- TAB 1: Contact -----
        {
          label: "Contact",
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
              name: "email",
              type: "email",
            },
            {
              type: "row",
              fields: [
                { name: "city", type: "text" },
                { name: "country", type: "text" },
              ]
            },
            {
              name: "extraInfo",
              type: "textarea",
              label: "Extra Info",
            },
          ]
        },

        // ----- TAB 2: Engagement -----
        {
          label: "Engagement",
          fields: [
            {
              name: "payment_plan",
              type: "text",
              label: "Payment Plan",
            },
            {
              name: "courseDemoBookings",
              type: "array",
              label: "Demo Bookings",
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "course",
                      type: "relationship",
                      relationTo: "web-courses",
                      required: true,
                      hasMany: false,
                      admin: {
                        allowCreate: false,
                        allowEdit: false
                      }
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
              name: "eventAttendance",
              type: "array",
              label: "Event Registrations",
              admin: {
                initCollapsed: true,
              },
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
                      label: "Campaign",
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
                    afterChange: [trackLeadEventAttendance]
                  }
                }
              ]
            },
          ]
        },

        // ----- TAB 3: Source -----
        {
          label: "Source",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "source",
                  type: "text",
                  label: "Lead Source",
                },
                {
                  name: 'metaFormId',
                  type: 'text',
                  label: "Meta Form ID",
                  admin: {
                    readOnly: true,
                  }
                },
              ]
            },
            {
              name: 'metaLeadId',
              type: 'text',
              unique: true,
              label: "Meta Lead ID",
              admin: {
                readOnly: true,
              }
            },
            {
              name: "student",
              type: "relationship",
              relationTo: "students",
              label: "Converted to Student",
              admin: {
                description: "Link to student record if lead was converted",
              }
            },
          ]
        },
      ]
    },
  ],
};