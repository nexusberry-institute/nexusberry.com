// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload'
import { checkAndCreateUser } from '@/hooks/checkAndCreateUser'
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
      beforeList: ['@/components/CSVExportButton#CSVExportButton'],
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
          label: "Personal Info",
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              hasMany: false,
              unique: true,
              access: {
                create: () => false,
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "studentEmail",
                  type: "email",
                  label: "Email",
                  virtual: true,
                  validate: (value, { data }) => {
                    if (value) return true
                    return "Please Enter Student Email"
                  },
                  admin: {
                    condition: (data) => !data.user,
                  },
                },
                {
                  name: "studentPassword",
                  type: "text",
                  label: "Password",
                  virtual: true,
                  validate: (value: any, { data }: any) => {
                    if (value || data?.user) return true
                    return "Please Enter Student Password"
                  },
                  admin: {
                    condition: (data) => !data.user,
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: 'fullName',
                  type: 'text',
                  label: 'Full Name',
                  minLength: 3,
                },
                {
                  name: 'phoneNumber',
                  type: 'text',
                  label: 'Phone Number',
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "gmail_username",
                  type: "text",
                  label: "Gmail Username",
                },
                {
                  name: 'education',
                  type: 'text',
                  label: 'Education',
                  admin: {
                    description: "Highest Student Education",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: 'dateOfBirth',
                  type: 'date',
                  label: 'Date of Birth',
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
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Address",
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'homeAddress',
                  type: 'text',
                  label: 'Home Address',
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'state',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'country',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: "Enrollments",
          fields: [
            {
              name: "studentEnrollments",
              type: "join",
              collection: "enrollments",
              on: "student",
            },
          ],
        },
      ],
    },
    // --- Sidebar fields ---
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: "otpVerified",
      type: "checkbox",
      label: "OTP Verified",
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: "otp",
      type: "text",
      label: "OTP Code",
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: "otpGeneratedAt",
      type: "date",
      label: "OTP Generated At",
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ]
};

