import { GlobalConfig } from "payload";

export const Meetings: GlobalConfig = {
  slug: "meetings",
  fields: [
    {
      name: "status",
      type: "select",
      options: [
        {
          label: "Start Meeting",
          value: "start",
        },
        {
          label: "End Meeting",
          value: "end",
        },
        {
          label: "Hold Meeting",
          value: "hold",
        }
      ],
      defaultValue: "hold",
      required: true,
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "link",
      label: "Meeting Link",
      type: "text",
      required: true,
    },
    {
      name: "agenda",
      type: "textarea",
      required: true,
    },
    {
      name: "assignToAll",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Select this if you want to assign to all members",
      }
    },
    {
      name: "assignToStudents",
      type: "relationship",
      relationTo: "students",
      hasMany: true,
      maxDepth: 0,
      admin: {
        condition: (data) => data.assignToAll ? false : true,
      }
    },
    {
      name: "assignToBatches",
      type: "relationship",
      relationTo: "batches",
      hasMany: true,
      maxDepth: 0,
      admin: {
        condition: (data) => data.assignToAll ? false : true,
      }
    },
    {
      name: "assignToLeads",
      type: "relationship",
      relationTo: "leads",
      hasMany: true,
      maxDepth: 0,
      admin: {
        condition: (data) => data.assignToAll ? false : true,
      }
    },
    {
      name: "announcement",
      type: "textarea",
      required: true,
      admin: {
        description: "This message will be shown when meeting is not scheduled",
      }
    }
  ],
};