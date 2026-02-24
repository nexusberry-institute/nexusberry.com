import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'
import { authenticated } from '@/access/authenticated'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    group: 'Academic Operations',
    defaultColumns: ['student', 'batch', 'status', 'admissionDate'],
  },
  access: {
    create: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
    read: authenticated,
    update: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
    delete: ({ req: { user } }) => checkRole(['superadmin', 'admin', 'operations'], user),
  },
  hooks: {
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
        { label: 'Completed', value: 'completed' },
        { label: 'Frozen', value: 'frozen' },
        { label: 'Dropped', value: 'dropped' },
      ],
      admin: {
        position: 'sidebar',
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
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
  ],
}
