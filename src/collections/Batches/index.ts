// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload';
import { getPayload } from "payload";
import config from '@payload-config'

export const Batches: CollectionConfig = {
  slug: "batches",
  admin: {
    useAsTitle: "slug",
    group: "Academic Operations"
  },
  access: {
    // create: checkAccess('batches', 'create'),
    // read: checkAccess('batches', 'read'),
    // update: checkAccess('batches', 'update'),
    // delete: checkAccess('batches', 'delete'),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Batch Details",
          fields: [
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description: "Pattern: Batch/StartDate/MMMYY.Teacher/nick.module/nick.TimeTable/Days/D.TimeTable/Time/HH:MM AM|PM ",
                components: {
                  Field: {
                    path: '@/fields/BatchesSlug',
                  }
                }
              }
            },
            {
              type: "row",
              fields: [
                {
                  name: "training-courses",
                  type: "relationship",
                  required: true,
                  relationTo: "training-courses",
                  hasMany: false,
                },
                {
                  name: "teachers",
                  type: "relationship",
                  relationTo: "teachers",
                  hasMany: true,
                }
              ]
            },
            {
              name: "modules",
              type: "relationship",
              relationTo: "modules",
              hasMany: true,
              filterOptions: async ({ data }) => {

                if (data["training-courses"]) {

                  const payload = await getPayload({ config })

                  const course = await payload.findByID({
                    collection: "training-courses",
                    id: data["training-courses"],
                    select: {
                      modules: true
                    },
                    depth: 0
                  })

                  return {
                    id: {
                      in: course.modules
                    }
                  }
                }

                return true
              }
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
                {
                  name: "endDate",
                  type: "date",
                  // hooks: {
                  //   beforeChange: [
                  //     ({ data }: any) => {
                  //       if(data.duration) {
                  //         return new Date(data.startDate.getTime() + data.duration * 7 * 24 * 60 * 60 * 1000)
                  //       }
                  //       return data.endDate
                  //     }
                  //   ]
                  // },
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
            {
              type: "row",
              fields: [
                {
                  name: "medium",
                  type: "select",
                  required: true,
                  options: [
                    "ONLINE",
                    "PHYSICAL",
                    "HYBRID",
                  ]
                },
                {
                  name: "canEnroll",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    style: { paddingTop: "25px" }
                  }
                },
                {
                  name: "active",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    style: { paddingTop: "25px" }
                  }
                },
              ]
            },
            {
              name: "note",
              type: "text",
            },
            {
              name: "waGroupLink",
              type: "text",
            },
            {
              name: "gcrLink",
              type: "text",
            },
          ]
        },
        {
          label: "Batch Enrollments",
          fields: [
            {
              name: "relatedEnrollments",
              label: "Enrollments In This Batch",
              type: "join",
              collection: "enrollments",
              on: "batchEnrollments.batch",
              // relationTo: "enrollments",
            }
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
        }
      ]
    }
    // {
    //   name: "TimeTable",
    //   type: "ui",
    //   admin: {
    //     components: {
    //       Field: {
    //         path: "@/components/BatchTimeTable"
    //       },
    //     }
    //   }
    // }
  ],
};