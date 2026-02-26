import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'
import { processAdmissionApproval } from './hooks/processAdmissionApproval'

export const AdmissionRequests: CollectionConfig = {
  slug: 'admission-requests',
  timestamps: true,
  admin: {
    useAsTitle: 'fullName',
    group: 'Academic Operations',
    defaultColumns: [
      'createdAt',
      'fullName',
      'email',
      'phoneNumber',
      'course',
      'status',
      'assignedBatch',
    ],
    listSearchableFields: ['fullName', 'email', 'phoneNumber'],
  },
  defaultSort: '-createdAt',
  access: {
    create: () => true,
    read: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin', 'operations', 'csr'], user),
    update: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin', 'operations'], user),
    delete: ({ req: { user } }) =>
      checkRole(['superadmin', 'admin'], user),
  },
  hooks: {
    afterChange: [processAdmissionApproval],
  },
  fields: [
    // ===== SIDEBAR FIELDS =====
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Under Review', value: 'reviewing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Processed', value: 'processed' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Set to "Approved" to trigger auto-creation of Student, Enrollment, and Fee Receipts.',
      },
    },
    {
      name: 'assignedBatch',
      type: 'relationship',
      relationTo: 'batches',
      admin: {
        position: 'sidebar',
        description: 'Required before approval. Assign the batch for enrollment.',
        allowCreate: false,
      },
      filterOptions: {
        active: { equals: true },
      },
    },
    {
      name: 'enrollmentMode',
      type: 'select',
      options: ['ONLINE', 'PHYSICAL', 'HYBRID'],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Link to existing Lead record if applicable.',
        allowCreate: false,
      },
    },
    {
      name: 'staffNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal notes for staff review.',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Reason for rejection.',
        condition: (data) => data?.status === 'rejected',
      },
    },

    // ===== MAIN CONTENT TABS =====
    {
      type: 'tabs',
      tabs: [
        // --- TAB 1: Personal Information ---
        {
          label: 'Personal Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fullName',
                  type: 'text',
                  required: true,
                  minLength: 3,
                  label: 'Full Name',
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  index: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneNumber',
                  type: 'text',
                  required: true,
                  label: 'Phone Number',
                },
                {
                  name: 'guardianPhone',
                  type: 'text',
                  label: 'Guardian Phone',
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
              type: 'row',
              fields: [
                {
                  name: 'education',
                  type: 'text',
                  label: 'Highest Education',
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
              ],
            },
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
                    { name: 'city', type: 'text' },
                    { name: 'province', type: 'text' },
                  ],
                },
                { name: 'country', type: 'text' },
              ],
            },
          ],
        },

        // --- TAB 2: Course & Payment ---
        {
          label: 'Course & Payment',
          fields: [
            {
              name: 'department',
              type: 'relationship',
              relationTo: 'departments',
              admin: {
                allowCreate: false,
                description: 'Department selected by the student.',
              },
            },
            {
              name: 'course',
              type: 'relationship',
              relationTo: 'web-courses',
              required: true,
              admin: {
                allowCreate: false,
                description: 'Course the student wants to enroll in.',
              },
            },
            {
              name: 'preferredMedium',
              type: 'select',
              options: ['ONLINE', 'PHYSICAL', 'HYBRID'],
              label: 'Preferred Medium',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'totalFeePackage',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: 'Total Fee Package (Rs.)',
                  admin: {
                    step: 500,
                    description: 'Total fee amount as decided with CSR.',
                  },
                },
                {
                  name: 'remainingInstallments',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 24,
                  label: 'Remaining Installments',
                  admin: {
                    step: 1,
                    description: 'Number of installments for remaining amount as decided with CSR.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'firstPaymentAmount',
                  type: 'number',
                  min: 0,
                  label: 'First Payment Amount',
                  admin: {
                    step: 100,
                    description: 'Amount of first installment paid by student.',
                  },
                },
                {
                  name: 'payDate',
                  type: 'date',
                  label: 'Pay Date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                      displayFormat: 'dd/MM/yyyy',
                    },
                    description: 'Date of first payment.',
                  },
                },
                {
                  name: 'paidMethod',
                  type: 'select',
                  defaultValue: 'BANK',
                  label: 'Payment Method',
                  options: ['BANK', 'CASH', 'JAZZCASH', 'EASYPAISA'],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'paymentProofImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Payment Screenshot',
                  admin: {
                    description: 'Screenshot of payment receipt.',
                  },
                },
                {
                  name: 'paymentProofText',
                  type: 'text',
                  maxLength: 50,
                  label: 'Transaction ID / Reference',
                  admin: {
                    description: 'Transaction ID or reference number. Max 50 characters.',
                  },
                },
              ],
            },
            {
              name: 'studentNote',
              type: 'textarea',
              maxLength: 500,
              label: 'Student Note',
              admin: {
                description: 'Any message from the student. Max 500 characters.',
              },
            },
          ],
        },

        // --- TAB 3: Installment Plan (staff fills) ---
        {
          label: 'Installment Plan',
          fields: [
            {
              name: 'totalFee',
              type: 'number',
              min: 0,
              label: 'Total Fee',
              admin: {
                step: 500,
                description: 'Total agreed fee for this enrollment.',
              },
            },
            {
              name: 'installments',
              type: 'array',
              label: 'Installment Schedule',
              admin: {
                description:
                  'Define the installment plan. First row is the initial payment (already received). Remaining rows are future installments.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'amount',
                      type: 'number',
                      required: true,
                      min: 0,
                      admin: { step: 100 },
                    },
                    {
                      name: 'dueDate',
                      type: 'date',
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: 'dayOnly',
                          displayFormat: 'MMM dd, yyyy',
                        },
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'status',
                      type: 'select',
                      defaultValue: 'PENDING',
                      options: ['RECEIVED', 'PENDING', 'DEAD'],
                    },
                    {
                      name: 'paidMethod',
                      type: 'select',
                      options: ['BANK', 'CASH', 'JAZZCASH', 'EASYPAISA'],
                    },
                  ],
                },
                {
                  name: 'note',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // --- TAB 4: Processing Results (read-only, auto-populated) ---
        {
          label: 'Processing Results',
          fields: [
            {
              name: 'submittedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                description: 'The Google-authenticated user who submitted the form.',
              },
            },
            {
              name: 'createdStudent',
              type: 'relationship',
              relationTo: 'students',
              admin: {
                readOnly: true,
                description: 'Auto-linked after approval.',
              },
            },
            {
              name: 'createdEnrollment',
              type: 'relationship',
              relationTo: 'enrollments',
              admin: {
                readOnly: true,
                description: 'Auto-linked after approval.',
              },
            },
            {
              name: 'processingError',
              type: 'textarea',
              admin: {
                readOnly: true,
                description:
                  'If approval processing failed, the error details appear here.',
              },
            },
            {
              name: 'processedAt',
              type: 'date',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'tempPassword',
              type: 'text',
              admin: {
                readOnly: true,
                description:
                  'Only set if hook created a new user (staff-created request). Share via WhatsApp.',
              },
            },
          ],
        },
      ],
    },
  ],
}
