import { CollectionConfig } from 'payload';

export const Attendances: CollectionConfig = {
  slug: 'attendance',
  admin: {
    listSearchableFields: ["batches"],
    group: "Academic Operations",
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
              required: true
            },
            {
              name: "expiry",
              type: "date",
              defaultValue: new Date(Date.now() + 2 * 60 * 60 * 1000),
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
              type: 'row',
              fields: [
                {
                  name: "batches",
                  type: "relationship",
                  relationTo: "batches",
                  required: true,
                  hasMany: true,
                  filterOptions: async ({ data, req }) => {

                    if (data.type === "CLASS") {

                      const daysOfWeek = ["SUNDAY", "MONDAY",
                        "TUESDAY", "WEDNESDAY", "THURSDAY",
                        "FRIDAY", "SATURDAY"]

                      const selectedDay = new Date(data.date).getDay()
                      const scheduledBatches = await req.payload.find({
                        collection: "time-table",
                        depth: 0,
                        select: {
                          batch: true,
                        },
                        where: {
                          day: { equals: daysOfWeek[selectedDay] }
                        }
                      })

                      if (scheduledBatches.totalDocs) {
                        return {
                          id: { in: scheduledBatches.docs.map(scheduledBatch => scheduledBatch.batch) },
                          active: { equals: true }
                        }
                      } else return false

                    } else return {
                      id: { not_equals: 0 },
                      active: { equals: true }
                    }
                  },
                  admin: {
                    description: "When Class Type is set to 'Class', only batches with a scheduled class for today will be shown"
                  }
                },
                {
                  name: "module",
                  type: "relationship",
                  relationTo: "modules",
                  filterOptions: ({ data }) => {
                    return {
                      id: { in: data.batch }
                    }
                  },
                  admin: {
                    description: "only modules from selected batches will be available"
                  }
                },
              ]
            },
            {
              type: 'row',
              fields: [
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
                  name: "teacher",
                  type: "relationship",
                  relationTo: "teachers",
                  filterOptions: ({ data }) => {
                    return {
                      id: { in: data.batch }
                    }
                  },
                  admin: {
                    description: "Teahcer for this class (OPTIONAl)"
                  }
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  defaultValue: new Date(),
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly",
                      displayFormat: "MMM dd, yyyy",
                    }
                  }
                },
                {
                  name: 'type',
                  label: "Class Type",
                  type: 'select',
                  defaultValue: "CLASS",
                  options: [
                    {
                      label: 'Class',
                      value: 'CLASS',
                    },
                    {
                      label: 'Lab',
                      value: 'LAB',
                    },
                    {
                      label: 'Make Up Class',
                      value: 'MAKE-UP-CLASS',
                    },
                    {
                      label: 'Make Up Lab',
                      value: 'MAKE-UP-LAB',
                    }
                  ]
                },
                {
                  name: 'medium',
                  type: 'select',
                  options: [
                    {
                      label: 'Physical',
                      value: 'PHYSICAL',
                    },
                    {
                      label: 'Online',
                      value: 'ONLINE',
                    },
                    {
                      label: 'Hybrid',
                      value: 'HYBRID',
                    }
                  ]
                },
              ]
            },
            {
              name: "content",
              type: "text"
            },
            // TODO: Create custom field component
            // {
            //   name: "TimeTable",
            //   type: "ui",
            //   admin: {
            //     components: {
            //       Field: {
            //         path: "@/fields/BatchesTimeTable"
            //       }
            //     }
            //   }
            // },
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
        },
        // TODO: Create custom field component
        // {
        //   label: "Mark Attendance",
        //   fields: [
        //     {
        //       name: "markAttendance",
        //       type: "ui",
        //       admin: {
        //         components: {
        //           Field: {
        //             path: "@/fields/MarkAttendance"
        //           }
        //         }
        //       }
        //     }
        //   ]
        // }
      ]
    }
  ]
};