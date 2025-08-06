// import { checkAccess } from "@/access/accessControl";
import { CollectionConfig } from "payload";

export const AttendanceDetails: CollectionConfig = {
  slug: "attendance-details",
  access: {
    // create: checkAccess('attendance-details', 'create'),
    // read: checkAccess('attendance-details', 'read'),
    // update: checkAccess('attendance-details', 'update'),
    // delete: checkAccess('attendance-details', 'delete'),
  },
  admin: {
    useAsTitle: "attendance",
    group: "Academic Operations",
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
          name: "medium",
          type: "radio",
          options: [
            "PHYSICAL",
            "ONLINE"
          ]
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: "enrollment",
          type: "relationship",
          relationTo: "enrollments",
          hasMany: false,
          required: true
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
  ],
};