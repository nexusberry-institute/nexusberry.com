import { CollectionConfig, getPayload } from 'payload';
import config from "@payload-config"

export const FeeReceipts: CollectionConfig = {
  slug: 'fee-receipts',
  defaultSort: 'dueDate',
  admin: {
    useAsTitle: 'enrollment',
    group: 'Academic Operations',
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: 'student',
          type: 'relationship',
          relationTo: 'students',
          hasMany: false,
          required: true,
          admin: {
            allowCreate: false
          }
        },
        {
          name: 'enrollment',
          type: 'relationship',
          relationTo: 'enrollments',
          hasMany: false,
          required: true,
          admin: {
            allowCreate: false
            // sortOptions: "-createdAt"
          },
          filterOptions: async ({ data }) => {

            if (data.student) {
              const payload = await getPayload({ config })

              const enrollments = await payload.find({
                collection: "enrollments",
                select: {
                  student: true
                },
                where: {
                  student: {
                    equals: data.student
                  }
                },
                depth: 0
              })

              const enrollmentsId = enrollments.docs.map(({ id }) => id)

              if (enrollmentsId.length) {
                return {
                  id: {
                    in: enrollmentsId
                  }
                }
              } else {
                return false
              }
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
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 100,
          }
        },
        {
          name: "verified",
          type: "checkbox",
          defaultValue: false,
          admin: {
            style: {
              marginTop: "2rem"
            }
          }
        }
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: 'paidMethod',
          type: 'select',
          defaultValue: "BANK",
          options: [
            "BANK",
            "CASH",
            "JAZZCASH",
            "EASYPAISA",
          ]
        },
        {
          name: "status",
          type: "select",
          defaultValue: "PENDING",
          options: [
            "RECEIVED",
            "PENDING",
            "DEAD",
          ]
        }
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: 'payDate',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: "MMM dd, yyyy",
            },
          }
        },
        {
          name: 'dueDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: "MMM dd, yyyy",
            },
          }
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: "proofText",
          type: "text",
        },
        {
          name: "proofImage",
          type: "upload",
          relationTo: "media",
          displayPreview: true
        }
      ]
    },
    {
      name: 'note',
      type: 'text',
    },
  ],
};