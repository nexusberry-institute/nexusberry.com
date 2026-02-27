import { CollectionConfig } from 'payload';

export const FeeReceipts: CollectionConfig = {
  slug: 'fee-receipts',
  defaultSort: '-dueDate',
  admin: {
    useAsTitle: 'student',
    group: 'Academic Operations',
    defaultColumns: ['student', 'amount', 'status', 'dueDate', 'payDate', 'installmentNumber', 'verified'],
  },
  fields: [
    // — Main area —
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
          name: 'paidMethod',
          type: 'select',
          defaultValue: "BANK",
          options: [
            "BANK",
            "CASH",
            "JAZZCASH",
            "EASYPAISA",
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.status !== 'PENDING',
          }
        },
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
            condition: (_, siblingData) => siblingData?.status !== 'PENDING',
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
          admin: {
            condition: (_, siblingData) => siblingData?.status !== 'PENDING',
          }
        },
        {
          name: "proofImage",
          type: "upload",
          relationTo: "media",
          displayPreview: true,
          admin: {
            condition: (_, siblingData) => siblingData?.status !== 'PENDING',
          }
        }
      ]
    },
    {
      name: 'note',
      type: 'text',
    },
    // — Sidebar —
    {
      name: "status",
      type: "select",
      defaultValue: "PENDING",
      options: [
        "RECEIVED",
        "PENDING",
        "DEAD",
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/fields/StatusField/StatusCell#StatusCell',
        },
      }
    },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.status !== 'PENDING',
      }
    },
    {
      name: 'installmentNumber',
      type: 'number',
      min: 1,
      admin: {
        position: 'sidebar',
        description: 'Installment sequence number (1 = first payment, 2 = second, etc.)',
      },
    },
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      hasMany: false,
      admin: {
        position: 'sidebar',
        allowCreate: false,
        description: 'Which enrollment this receipt is for.',
      },
    },
    {
      name: 'admissionRequest',
      type: 'relationship',
      relationTo: 'admission-requests',
      hasMany: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The admission request that generated this receipt (if auto-created).',
      },
    },
  ],
};
