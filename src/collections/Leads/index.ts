import { CollectionConfig } from "payload";
// import { checkAccess } from "@/access/accessControl";
// import { emailOnEventRegistration } from './hooks/email'
import { updateCounters } from './hooks/counters'
import {
  trackLeadSubmission,
  trackLeadEventAttendance,
  trackInterestedLead,
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
      name: "stage",
      type: "select",
      defaultValue: "NEW",
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
      },
      admin: {
        position: "sidebar",
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
    {
      name: "notes",
      type: "textarea",
      label: "Staff Notes",
      admin: {
        position: "sidebar",
      }
    },

    // ===== MAIN CONTENT WITH TABS =====
    {
      type: "tabs",
      tabs: [
        // ----- TAB 1: Personal Info -----
        {
          label: "Personal Info",
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
                  type: "email",
                },
                {
                  name: "gender",
                  type: "select",
                  options: [
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                  ]
                },
              ]
            },
            {
              type: "collapsible",
              label: "Location",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "area", type: "text" },
                    { name: "city", type: "text" },
                  ]
                },
                {
                  type: "row",
                  fields: [
                    { name: "province", type: "text" },
                    { name: "country", type: "text" },
                  ]
                },
              ]
            },
            {
              type: "collapsible",
              label: "Background",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "education", type: "text" },
                    { name: "job_info", type: "text", label: "Job Info" },
                  ]
                },
              ]
            },
          ]
        },

        // ----- TAB 2: Follow Up -----
        {
          label: "Follow Up",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "reminder_date",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly",
                    }
                  }
                },
                {
                  name: "reminder_note",
                  type: "textarea",
                },
              ]
            },
            {
              name: "query",
              type: "textarea",
              label: "Lead Query",
            },
            {
              name: "lead_issue",
              type: "textarea",
              label: "Issues/Objections",
            },
          ]
        },

        // ----- TAB 3: Course Interest -----
        {
          label: "Course Interest",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "module",
                  type: "relationship",
                  relationTo: "modules",
                  label: "Interested Module",
                },
                {
                  name: "department",
                  type: "relationship",
                  relationTo: "departments",
                  label: "Interested Department",
                },
              ]
            },
            {
              name: "payment_plan",
              type: "text",
              label: "Preferred Payment Plan",
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
          ]
        },

        // ----- TAB 4: Events -----
        {
          label: "Events",
          fields: [
            {
              name: "eventAttendance",
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

        // ----- TAB 5: Conversion -----
        {
          label: "Conversion",
          fields: [
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

        // ----- TAB 6: Source & Tracking -----
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
              type: "collapsible",
              label: "Activity History",
              fields: [
                {
                  name: "activity",
                  type: "json",
                  label: "Activity Log",
                },
                {
                  name: "lead_engagement",
                  type: "json",
                  label: "Engagement Data",
                }
              ]
            },
          ]
        },
      ]
    },
  ],
};