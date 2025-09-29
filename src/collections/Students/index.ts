// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig, PayloadRequest, CustomComponent } from 'payload'
import { checkAndCreateUser } from '@/hooks/checkAndCreateUser'
import { CSVExportButton } from '@/components/CSVExportButton'
// import type { NextApiRequest, NextApiResponse } from 'next'
import { trackNewStudentAdmission } from "./hooks/track";

export const Students: CollectionConfig = {
  slug: "students",
  admin: {
    group: "People Management",
    defaultColumns: ['user', 'fullName', 'phoneNumber'],
    useAsTitle: 'fullName',
    listSearchableFields: ['fullName', 'phoneNumber', "user.email"],
    components: {
      beforeList: [CSVExportButton as any],
    }
  },
  hooks: {
    beforeChange: [checkAndCreateUser],
    afterChange: [trackNewStudentAdmission]
  },

  access: {
    // create: checkAccess('students', 'create'),
    // read: checkAccess('students', 'read'),
    // update: checkAccess('students', 'update'),
    // delete: checkAccess('students', 'delete'),
  },

  endpoints: [
    {
      path: '/export-csv',
      method: 'get',
      handler: async (req) => {
        try {
          const payloadInstance = req.payload
          if (!payloadInstance) {
            return new Response(JSON.stringify({ error: 'Payload instance not available' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            })
          }

          const result = await payloadInstance.find({
            collection: 'students',
            limit: 0,
            depth: 0,
          })

          let csvContent: string
          if (!result.docs?.length) {
            csvContent = '"Full Name"\n'
          } else {
            const csvRows = ['"Full Name"']
            for (const student of result.docs) {
              if (student.fullName) {
                csvRows.push(`"${student.fullName.replace(/"/g, '""')}"`)
              }
            }
            csvContent = csvRows.join('\n')
          }

          return new Response(csvContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': 'attachment; filename="students_names.csv"',
            }
          })
        } catch (error: any) {
          console.error('CSV export error:', error)
          return new Response(JSON.stringify({ error: 'Export failed', message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    },
    {
      path: "/export-emails",
      method: "get",
      handler: async (req) => {
        try {
          const result = await req.payload.find({
            collection: "students",
            where: {
              and: [
                { otpVerified: { equals: true } },
                { user: { exists: true } }
              ]
            },
            depth: 1,
            limit: 0
          })

          const csvRows = ['"Email"']
          for (const student of result.docs) {
            if (student.user && typeof student.user === 'object' && 'email' in student.user && student.user.email) {
              csvRows.push(`"${(student.user.email as string).replace(/"/g, '""')}"`)
            }
          }

          return new Response(csvRows.join("\n"), {
            status: 200,
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": 'attachment; filename="students_emails.csv"'
            }
          })
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          })
        }
      }
    },


    // {
    //   path: '/export-mobiles',
    //   method: 'get',
    //   handler: async (req) => {
    //     try {
    //       const result = await req.payload.find({
    //         collection: 'students',
    //         where: { phoneNumber: { exists: true } }, // only those with phone numbers
    //         limit: 0,
    //         depth: 0,
    //       })

    //       const csvRows = ['"Mobile Number"']
    //       for (const student of result.docs) {
    //         if (student.phoneNumber) {
    //           csvRows.push(`"${student.phoneNumber.replace(/"/g, '""')}"`)
    //         }
    //       }

    //       return new Response(csvRows.join('\n'), {
    //         status: 200,
    //         headers: {
    //           'Content-Type': 'text/csv; charset=utf-8',
    //           'Content-Disposition': 'attachment; filename="students_mobiles.csv"',
    //         },
    //       })
    //     } catch (error: any) {
    //       return new Response(JSON.stringify({ error: 'Export failed', message: error.message }), {
    //         status: 500,
    //         headers: { 'Content-Type': 'application/json' },
    //       })
    //     }
    //   }
    // },


  ],

  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Student Information",
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              hasMany: false,
              unique: true,
              access: {
                create: () => false
              }
            },
            {
              type: "row",
              fields: [
                {
                  name: "studentEmail",
                  type: "email",
                  virtual: true,
                  validate: (value, { data }) => {
                    if (value) {
                      return true
                    }
                    return "Please Enter Student Email"
                  },
                  admin: {
                    condition: (data) => {
                      if (data.user) {
                        return false
                      }
                      return true
                    }
                  }
                },
                {
                  name: "studentPassword",
                  type: "text",
                  virtual: true,
                  validate: (value: any, { data }: any) => {
                    if (value) {
                      return true
                    }
                    if (data?.user) {
                      return true
                    }
                    return "Please Enter Student Password"
                  },
                  admin: {
                    condition: (data) => {
                      if (data.user) {
                        return false
                      }
                      return true
                    }
                  }
                },
              ]
            },
            {
              name: 'fullName',
              type: 'text',
              minLength: 3
            },
            {
              name: 'phoneNumber',
              type: 'text',
            },
            {
              name: "gmail_username",
              type: "text",
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'dd/MM/yyyy',
                },
              },
            },
            {
              name: 'gender',
              type: 'select',
              options: [
                {
                  label: 'Male',
                  value: 'male',
                },
                {
                  label: 'Female',
                  value: 'female',
                }
              ]
            },
            {
              name: 'education',
              type: 'text',
              admin: {
                description: "Highest Student Education"
              }
            },
            {
              name: "otp",
              type: "text",
              admin: {
                readOnly: true,
              },
            },
            {
              name: "otpVerified",
              type: "checkbox",
            },
            {
              name: "otpGeneratedAt",
              type: "date",
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'homeAddress',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                },
              ],
            },
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: "Student Enrollments",
          fields: [
            {
              name: "studentEnrollments",
              type: "join",
              collection: "enrollments",
              on: "student",
            }
          ]
        }
      ]
    }
  ]
};

