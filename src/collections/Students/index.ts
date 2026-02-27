import { CollectionConfig, Where } from 'payload'
import { trackNewStudentAdmission } from './hooks/track'
import { exportCsvEndpoint, exportEmailsEndpoint } from './endpoints'

export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    group: 'People Management',
    defaultColumns: ['id', 'user', 'fullName', 'phoneNumber', 'address.city', 'createdAt'],
    useAsTitle: 'fullName',
    listSearchableFields: ['fullName', 'phoneNumber'],
    components: {
      beforeList: ['@/components/CSVExportButton#CSVExportButton'],
    },
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [trackNewStudentAdmission],
  },
  access: {},
  endpoints: [exportCsvEndpoint, exportEmailsEndpoint],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Personal Info',
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              hasMany: false,
              unique: true,
              filterOptions: async ({ id, req }) => {
                const existingStudents = await req.payload.find({
                  collection: 'students',
                  depth: 0,
                  limit: 0,
                  select: { user: true },
                  where: id ? { id: { not_equals: id } } : {},
                })

                const linkedUserIds = existingStudents.docs
                  .map((s) => s.user)
                  .filter(Boolean)

                const conditions: Where[] = [{ roles: { contains: 'student' } }]
                if (linkedUserIds.length > 0) {
                  conditions.push({ id: { not_in: linkedUserIds } })
                }

                return { and: conditions }
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fullName',
                  type: 'text',
                  label: 'Full Name',
                  required: true,
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
              type: 'row',
              fields: [
                {
                  name: 'fatherName',
                  type: 'text',
                  label: 'Father Name',
                },
                {
                  name: 'guardianPhone',
                  type: 'text',
                  label: 'Guardian Phone',
                  admin: {
                    description: 'Emergency / parent contact number',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cnic',
                  type: 'text',
                  label: 'CNIC',
                  admin: {
                    description: 'National Identity Card number',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'education',
                  type: 'text',
                  label: 'Education',
                  admin: {
                    description: 'Highest Student Education',
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
            // Address group inside Personal Info tab
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
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'province',
                      type: 'text',
                      label: 'Province',
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
          label: 'Enrollments',
          fields: [
            {
              name: 'enrollments',
              type: 'join',
              collection: 'enrollments',
              on: 'student',
            },
          ],
        },
        {
          label: 'Fee Receipts',
          fields: [
            {
              name: 'feeReceipts',
              type: 'join',
              collection: 'fee-receipts',
              on: 'student',
            },
          ],
        },
      ],
    },
    // --- Sidebar fields ---
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On Hold', value: 'on-hold' },
        { label: 'Withdrawn', value: 'withdrawn' },
        { label: 'Graduated', value: 'graduated' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'admissionDate',
      type: 'date',
      label: 'Admission Date',
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
