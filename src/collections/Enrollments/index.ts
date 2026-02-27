import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'
import { authenticated } from '@/access/authenticated'
import { syncStudentStatus } from './hooks/syncStudentStatus'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    group: 'Academic Operations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'student', 'batch', 'status', 'admissionDate', 'mode'],
  },
  access: {
    create: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
    read: authenticated,
    update: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
    delete: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
  },
  hooks: {
    afterChange: [syncStudentStatus],
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data?.student || !data?.batch) return data
        const existing = await req.payload.find({
          collection: 'enrollments',
          where: {
            and: [
              { student: { equals: data.student } },
              { batch: { equals: data.batch } },
            ],
          },
          limit: 1,
        })
        if (existing.docs.length > 0) {
          throw new Error('This student is already enrolled in this batch.')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            const studentVal = data?.student
            const batchVal = data?.batch

            if (!studentVal || !batchVal) return undefined

            const studentDoc =
              typeof studentVal === 'object'
                ? studentVal
                : await req.payload.findByID({ collection: 'students', id: studentVal, depth: 0 })

            const batchDoc =
              typeof batchVal === 'object'
                ? batchVal
                : await req.payload.findByID({ collection: 'batches', id: batchVal, depth: 0 })

            return `${studentDoc.fullName} — ${batchDoc.slug}`
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'student',
          type: 'relationship',
          relationTo: 'students',
          required: true,
          index: true,
        },
        {
          name: 'batch',
          type: 'relationship',
          relationTo: 'batches',
          required: true,
          index: true,
          filterOptions: {
            active: { equals: true },
          },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
    },
    // Sidebar fields
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Graduated', value: 'graduated' },
        { label: 'Frozen', value: 'frozen' },
        { label: 'Dropped', value: 'dropped' },
        { label: 'Refund Requested', value: 'refund-requested' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Status of this specific course enrollment',
      },
    },
    {
      name: 'mode',
      type: 'select',
      options: ['ONLINE', 'PHYSICAL', 'HYBRID'],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'admissionDate',
      type: 'date',
      label: 'Enrollment Date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
    // Virtual join — shows fee receipts linked to this enrollment
    {
      name: 'feeReceipts',
      type: 'join',
      collection: 'fee-receipts',
      on: 'enrollment',
    },
  ],
}
