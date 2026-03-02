import { CollectionConfig } from "payload";
import { checkRole } from "@/access/checkRole";
import { authenticated } from "@/access/authenticated";

export const AttendanceDetails: CollectionConfig = {
  slug: "attendance-details",
  access: {
    create: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
    read: authenticated,
    update: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
    delete: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations', 'teacher'], user),
  },
  admin: {
    useAsTitle: "attendance",
    group: "Academic Operations",
    defaultColumns: ['student', 'attendance', 'status', 'medium', 'joinedAt'],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "attendance",
          type: "relationship",
          relationTo: "attendance",
          hasMany: false,
          required: true
        },
        {
          name: "student",
          type: "relationship",
          relationTo: "students",
          hasMany: false,
          required: true,
          index: true,
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "medium",
          type: "radio",
          options: [
            "PHYSICAL",
            "ONLINE"
          ]
        },
        {
          name: "status",
          type: "select",
          options: [
            {
              label: "Present",
              value: "PRESENT",
            },
            {
              label: "Absent",
              value: "ABSENT",
            },
            {
              label: "Leave",
              value: "LEAVE",
            }
          ]
        },
      ]
    },
    {
      name: "joinedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "p dd/MM/yyyy",
        },
        description: "Auto-set when student joins online class",
      },
    },
  ],
};