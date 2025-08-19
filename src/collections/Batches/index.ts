// import { checkAccess } from '@/access/accessControl';
// import { CollectionConfig } from 'payload';
// import { message } from 'antd';
import { getPayload } from "payload";
import config from '@payload-config'
import { CollectionConfig, PayloadRequest, CustomComponent } from 'payload'
import { ExportAllBatchEmailsButton } from '@/components/BatchCSVExport';
import { ExportBatchEmails } from "@/components/ExportButtons/ExportBatchEmails";

export const Batches: CollectionConfig = {
  slug: "batches",

  admin: {
    useAsTitle: "slug",
    group: "Academic Operations",
    components: {
      beforeList: [ExportAllBatchEmailsButton as any],
      edit: {
        beforeDocumentControls: [ExportBatchEmails as any],
      },
    }
  },

  access: {
    // create: checkAccess('batches', 'create'),
    // read: checkAccess('batches', 'read'),
    // update: checkAccess('batches', 'update'),
    // delete: checkAccess('batches', 'delete'),
  },

  // payload.config.ts ya custom endpoint file me
  endpoints: [
    {
      path: '/export-all-batch-emails',
      method: 'get',
      handler: async (req) => {
        try {
          // Get all batches
          const batches = await req.payload.find({
            collection: 'batches',
            limit: 0,
            depth: 0,
            select: {
              id: true,
              slug: true
            }
          });

          const allEmails = new Set(); // Use Set to avoid duplicates

          // Loop through each batch
          for (const batch of batches.docs) {
            // Get enrollments for this batch
            const enrollments = await req.payload.find({
              collection: 'enrollments',
              where: {
                'batchEnrollments.batch': {
                  equals: batch.id
                }
              },
              depth: 2, // Deep enough to get student -> user -> email
              limit: 0
            });

            // Extract emails from enrollments
            for (const enrollment of enrollments.docs) {
              if (enrollment.student && typeof enrollment.student === 'object') {
                const student = enrollment.student as any;

                // Get user email if exists
                if (student.user && typeof student.user === 'object' && student.user.email) {
                  const email = student.user.email as string;
                  allEmails.add(email);
                }
              }
            }
          }

          // Convert Set to Array and create CSV
          const emailsArray = Array.from(allEmails) as string[];
          const csvRows = ['"Email"'];

          for (const email of emailsArray) {
            csvRows.push(`"${email.replace(/"/g, '""')}"`);
          }

          const csvContent = csvRows.join('\n');

          return new Response(csvContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': 'attachment; filename="all_batches_students_emails.csv"',
            }
          });

        } catch (error: any) {
          console.error('All batch emails export error:', error);
          return new Response(JSON.stringify({
            error: 'Export failed',
            message: error.message
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
    {
      path: '/export-all-batch-mobiles',
      method: 'get',
      handler: async (req) => {
        try {
          // Get all batches
          const batches = await req.payload.find({
            collection: 'batches',
            limit: 0,
            depth: 0,
            select: {
              id: true,
              slug: true
            }
          });

          const allMobiles = new Set(); // Use Set to avoid duplicates

          // Loop through each batch
          for (const batch of batches.docs) {
            // Get enrollments for this batch
            const enrollments = await req.payload.find({
              collection: 'enrollments',
              where: {
                'batchEnrollments.batch': {
                  equals: batch.id
                }
              },
              depth: 2, // Deep enough to get student -> user -> mobile
              limit: 0
            });

            // Extract mobile numbers from enrollments
            for (const enrollment of enrollments.docs) {
              if (enrollment.student && typeof enrollment.student === 'object') {
                const student = enrollment.student as any;

                // Get student phone number if exists
                if (student.phoneNumber) {
                  const mobile = student.phoneNumber as string;
                  allMobiles.add(mobile);
                }
              }
            }
          }

          // Convert Set to Array and create CSV
          const mobilesArray = Array.from(allMobiles) as string[];
          const csvRows = ['"Mobile Number"'];

          for (const mobile of mobilesArray) {
            csvRows.push(`"${mobile.replace(/"/g, '""')}"`);
          }

          const csvContent = csvRows.join('\n');

          return new Response(csvContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': 'attachment; filename="all_batches_students_mobiles.csv"',
            }
          });

        } catch (error: any) {
          console.error('All batch mobiles export error:', error);
          return new Response(JSON.stringify({
            error: 'Export failed',
            message: error.message
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },


  ],

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
      ],
      // admin: {
      //   components: {
      //     Field: {
      //       path: "@/components/BatchCSVExport"
      //     },
      //   }
      // }
    },

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