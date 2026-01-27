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
  timestamps: true,
  admin: {
    useAsTitle: "name",
    group: "Marketing & Outreach",
    defaultColumns: ['name', 'mobile', 'stage', 'course', 'createdAt'],
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
      label: "Interested Course",
      admin: {
        position: "sidebar",
        description: "Course the lead is interested in",
      }
    },
    {
      name: "stage",
      type: "select",
      label: "Lead Stage",
      defaultValue: "NEW",
      index: true,
      options: [
        { label: "New", value: "NEW" },
        { label: "Qualified", value: "QUALIFIED" },
        { label: "Not Qualified", value: "NOT_QUALIFIED" },
        { label: "Negotiation", value: "NEGOTIATION" },
        { label: "Enrolled", value: "ENROLLED" },
        { label: "Lost", value: "LOST" },
      ],
      hooks: {
        afterChange: [trackInterestedLead],
      },
      admin: {
        position: "sidebar",
        description: "Current stage in the sales pipeline",
      }
    },
    {
      name: "lostReason",
      type: "select",
      label: "Lost Reason",
      options: [
        { label: "Price too high", value: "price" },
        { label: "Chose competitor", value: "competitor" },
        { label: "Not interested anymore", value: "not_interested" },
        { label: "Bad timing", value: "timing" },
        { label: "No response", value: "no_response" },
        { label: "Other", value: "other" },
      ],
      admin: {
        position: "sidebar",
        description: "Why the lead was lost",
        condition: (data) => data?.stage === "LOST",
      }
    },
    {
      name: "notes",
      type: "textarea",
      label: "Staff Notes",
      admin: {
        position: "sidebar",
        description: "Internal notes from CSR interactions",
      }
    },
    {
      name: "label",
      type: "text",
      label: "Label",
      admin: {
        position: "sidebar",
        description: "Custom tag for categorization",
      }
    },
    {
      type: "row",
      admin: {
        position: "sidebar",
      },
      fields: [
        {
          name: "confirmedAttending",
          type: "checkbox",
          label: "Trial Confirmed",
          defaultValue: false,
          admin: {
            description: "Confirmed for demo",
          }
        },
        {
          name: "actuallyAttended",
          type: "checkbox",
          label: "Attended",
          defaultValue: false,
          admin: {
            description: "Actually attended",
          }
        },
      ]
    },
    {
      name: "reminder_date",
      type: "date",
      label: "Follow-up Date",
      admin: {
        position: "sidebar",
        description: "Date to follow up with this lead",
        date: {
          pickerAppearance: "dayOnly",
        }
      }
    },
    {
      name: "assign_to",
      type: "relationship",
      relationTo: "staffs",
      label: "Assigned To",
      hasMany: false,
      admin: {
        position: "sidebar",
        description: "Staff member responsible for this lead",
      }
    },
    {
      name: "not_responding",
      type: "checkbox",
      label: "Not Responding",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Lead is not answering calls/messages",
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
                  label: "Full Name",
                  required: true,
                },
                {
                  name: "mobile",
                  type: "text",
                  label: "Mobile Number",
                  index: true,
                  admin: {
                    description: "Include country code (e.g., 923001234567)",
                    components: {
                      afterInput: ['@/fields/MobileField/MobileActions#MobileActions'],
                      Cell: '@/fields/MobileField/MobileCell#MobileCell',
                    },
                  },
                },
              ]
            },
            {
              name: "email",
              type: "email",
              label: "Email Address",
            },
            {
              type: "row",
              fields: [
                { name: "city", type: "text", label: "City" },
                { name: "province", type: "text", label: "Province / State" },
                { name: "country", type: "text", label: "Country" },
              ]
            },
            {
              name: 'currentBackground',
              type: 'text',
              label: 'Current Status / Background',
              admin: {
                placeholder: 'e.g., Student, Freelancer, or Non-tech Professional',
                description: 'The user\'s current professional or academic standing.',
              },
            },
            {
              name: 'priorExperience',
              type: 'text',
              label: 'Current Technical Knowledge',
              admin: {
                placeholder: 'Describe your level with course prerequisites',
                description: 'Current grasp of relevant tools (e.g., HTML/JS for Web or Python/Math for AI).',
              },
            },
            {
              name: 'extraInfo',
              type: 'textarea',
              label: 'Extra Information',
              admin: {
                description: 'Additional information provided by the lead',
              },
            }
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
              admin: {
                description: "Preferred payment plan discussed with lead",
              }
            },
            {
              name: "courseDemoBookings",
              type: "array",
              label: "Demo Bookings",
              admin: {
                initCollapsed: true,
                description: "Course demos/trials the lead has booked",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "course",
                      type: "relationship",
                      relationTo: "web-courses",
                      label: "Course",
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
                      label: "Booking Date",
                      required: true,
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
                description: "Events/webinars the lead registered for",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "event",
                      type: "relationship",
                      relationTo: "events",
                      label: "Event",
                      required: true,
                      hasMany: false,
                    },
                    {
                      name: "campaign",
                      type: "relationship",
                      relationTo: "campaigns",
                      label: "Campaign",
                      required: false,
                      admin: {
                        description: "Marketing campaign source",
                      }
                    }
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "source",
                      type: "text",
                      label: "Registration Source",
                      admin: {
                        description: "Where they registered from",
                      }
                    },
                    {
                      name: "registeredAt",
                      type: "date",
                      label: "Registration Date",
                    }
                  ],
                },
                {
                  name: "hasAttended",
                  type: "checkbox",
                  label: "Has Attended",
                  defaultValue: false,
                  admin: {
                    description: "Check if lead attended this event",
                  },
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
                  type: "select",
                  label: "Lead Source",
                  options: [
                    { label: "Facebook", value: "facebook" },
                    { label: "Instagram", value: "instagram" },
                    { label: "Website", value: "website" },
                    { label: "YouTube", value: "youtube" },
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "Referral", value: "referral" },
                    { label: "Walk-in", value: "walk_in" },
                    { label: "Other", value: "other" },
                  ],
                  admin: {
                    description: "Where the lead came from",
                  }
                },
                {
                  name: "campaignId",
                  type: "text",
                  label: "Campaign ID",
                  admin: {
                    description: "Marketing campaign identifier for tracking",
                  }
                },
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: 'metaFormId',
                  type: 'text',
                  label: "Meta Form ID",
                  admin: {
                    readOnly: true,
                    description: "Facebook/Instagram form identifier",
                  }
                },
                {
                  name: 'metaLeadId',
                  type: 'text',
                  unique: true,
                  label: "Meta Lead ID",
                  admin: {
                    readOnly: true,
                    description: "Unique lead ID from Meta Ads",
                  }
                },
              ]
            },
            {
              name: "student",
              type: "relationship",
              relationTo: "students",
              label: "Converted to Student",
              admin: {
                description: "Link to student record after enrollment",
              }
            },
          ]
        },
      ]
    },
  ],
};