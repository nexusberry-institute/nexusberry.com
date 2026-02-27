import { CollectionConfig } from 'payload'

export const Batches: CollectionConfig = {
  slug: "batches",

  admin: {
    useAsTitle: "slug",
    group: "Academic Operations",
  },

  access: {
    // create: checkAccess('batches', 'create'),
    // read: checkAccess('batches', 'read'),
    // update: checkAccess('batches', 'update'),
    // delete: checkAccess('batches', 'delete'),
  },

  fields: [
    // Sidebar fields
    {
      name: "medium",
      type: "select",
      required: true,
      options: [
        "ONLINE",
        "PHYSICAL",
        "HYBRID",
      ],
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
      }
    },
    {
      name: "note",
      type: "textarea",
      admin: {
        position: "sidebar",
      }
    },

    // Main content
    {
      type: "tabs",
      tabs: [
        {
          label: "Batch Details",
          fields: [
            {
              name: "courseTitle",
              type: "text",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description: "Pattern: Courese.Teacher.MonthYY.DaysTime",
                // TODO: Create custom field component
                // components: {
                //   Field: {
                //     path: '@/fields/BatchesSlug',
                //   }
                // }
              }
            },
            {
              type: "row",
              fields: [
                {
                  name: "teachers",
                  type: "relationship",
                  relationTo: "teachers",
                  hasMany: true,
                },
                {
                  name: "duration",
                  type: "number",
                  min: 1,
                  required: true,
                  admin: {
                    description: "Duration in weeks",
                    step: 1,
                  },
                  validate: (value?: number | null) => {
                    if (!Number.isInteger(value)) {
                      return "Duration must be an integer"
                    }
                    return true
                  }
                },
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: "startDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly",
                      displayFormat: "MMM dd, yyyy",
                    }
                  }
                },
                {
                  name: "endDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly",
                      displayFormat: "MMM dd, yyyy",
                    }
                  },
                  validate: (value, { data }: any) => {
                    if (data.startDate && !value) return "If start date is provided, End date must be provided."
                    if (data.startDate && data.startDate > (value || 0)) {
                      return "End date must be greater than start date"
                    }
                    return true
                  }
                },
              ]
            },
          ]
        },
        {
          label: "Batch TimeTable",
          fields: [
            {
              name: "batchTimeTable",
              label: "TimeTable For This Batch",
              type: "join",
              collection: "time-table",
              on: "batch",
              maxDepth: 1,
            }
          ]
        },
        {
          label: "Enrolled Students",
          fields: [
            {
              name: "batchEnrollments",
              label: "Enrollments",
              type: "join",
              collection: "enrollments",
              on: "batch",
              maxDepth: 1,
            }
          ]
        }
      ],
    },
  ],
};
