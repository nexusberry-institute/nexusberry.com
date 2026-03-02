import { CollectionConfig } from 'payload';

export const Attendances: CollectionConfig = {
  slug: 'attendance',
  admin: {
    listSearchableFields: ["batches"],
    group: "Academic Operations",
    defaultColumns: ['batches', 'teacher', 'date', 'visible'],
  },
  defaultSort: "-date",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Attendance",
          fields: [
            {
              name: "onlineClassLink",
              type: "text",
            },
            {
              name: "expiry",
              type: "date",
              defaultValue: () => new Date(Date.now() + 90 * 60 * 1000),
              admin: {
                position: "sidebar",
                description: "After expiry time, the link will automatically be hidden from the student portal",
                date: {
                  pickerAppearance: "dayAndTime",
                  displayFormat: "p dd/MM/yyyy"
                }
              }
            },
            {
              name: "visible",
              type: "checkbox",
              defaultValue: true,
              admin: {
                position: "sidebar"
              }
            },
            {
              name: 'date',
              type: 'date',
              defaultValue: () => new Date(),
              admin: {
                position: "sidebar",
                date: {
                  pickerAppearance: "dayOnly",
                  displayFormat: "MMM dd, yyyy",
                }
              }
            },
            {
              type: 'row',
              fields: [
                {
                  name: "batches",
                  type: "relationship",
                  relationTo: "batches",
                  required: true,
                  hasMany: true,
                  filterOptions: {
                    active: { equals: true },
                  },
                },
                {
                  name: "teacher",
                  type: "relationship",
                  relationTo: "teachers",
                },
              ]
            },
            {
              name: "users",
              type: "relationship",
              relationTo: "users",
              hasMany: true,
              filterOptions: {
                roles: {
                  contains: "student"
                }
              },
              admin: {
                description: "Selected users can access this class regardless of enrollment status and restrictions"
              }
            },
            {
              name: "staffNotes",
              type: "textarea",
              admin: {
                description: "Internal notes for teachers and staff",
              }
            },
          ],
        },
        {
          label: "Attendance Details",
          fields: [
            {
              name: "relatedAttendanceDetails",
              type: "join",
              collection: "attendance-details",
              on: "attendance",
            }
          ]
        }
      ]
    }
  ]
};
