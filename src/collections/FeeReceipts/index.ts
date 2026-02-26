import { CollectionConfig } from 'payload';

export const FeeReceipts: CollectionConfig = {
  slug: 'fee-receipts',
  defaultSort: 'dueDate',
  admin: {
    useAsTitle: 'student',
    group: 'Academic Operations',
  },
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
    // Enrollment & admission tracking
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      hasMany: false,
      admin: {
        allowCreate: false,
        description: 'Which enrollment this receipt is for.',
      },
    },
    {
      name: 'installmentNumber',
      type: 'number',
      min: 1,
      admin: {
        description: 'Installment sequence number (1 = first payment, 2 = second, etc.)',
      },
    },
    {
      name: 'admissionRequest',
      type: 'relationship',
      relationTo: 'admission-requests',
      hasMany: false,
      admin: {
        readOnly: true,
        description: 'The admission request that generated this receipt (if auto-created).',
      },
    },
  ],
};