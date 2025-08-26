// import { checkAccess } from "@/access/accessControl";
import { anyone } from "@/access/anyone";
import { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "mobile",
    group: "Marketing & Outreach",
  },
  access: {
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
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
          name: "event",
          type: "relationship",
          relationTo: "events",
        },
        {
          name: "campaign",
          type: "relationship",
          relationTo: "campaigns",
          required: false,
          label: "Campaign Source",
        },
        {
          name: "assign_to",
          type: "relationship",
          relationTo: "staffs",
          hasMany: false
        },
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