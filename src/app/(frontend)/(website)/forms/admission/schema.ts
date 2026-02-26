import { z } from 'zod'

export const admissionSchema = z.object({
  // Step 1: Personal Details
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^\d{10,}$/, 'Phone number must be at least 10 digits (numbers only)'),
  gender: z.enum(['male', 'female'], { required_error: 'Please select gender' }),
  education: z.string().min(1, 'Highest education is required'),
  guardianPhone: z.string().optional(),
  cnic: z.string().optional(),
  dateOfBirth: z.string().optional(),

  // Step 2: Address
  address: z.object({
    homeAddress: z.string().min(1, 'Home address is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  // Step 3: Course Selection
  department: z.number({ required_error: 'Please select a department' }),
  course: z.number({ required_error: 'Please select a course' }),
  preferredMedium: z.enum(['ONLINE', 'PHYSICAL', 'HYBRID'], {
    required_error: 'Please select preferred medium',
  }),

  // Step 4: Payment Details
  totalFeePackage: z
    .number({ required_error: 'Total fee package is required' })
    .min(1, 'Total fee must be greater than 0'),
  remainingInstallments: z
    .number({ required_error: 'Number of installments is required' })
    .min(1, 'Must be at least 1 installment')
    .max(24, 'Maximum 24 installments'),
  firstPaymentAmount: z
    .number({ required_error: 'First payment amount is required' })
    .min(0),
  payDate: z.string().min(1, 'Pay date is required'),
  paidMethod: z.enum(['BANK', 'CASH', 'JAZZCASH', 'EASYPAISA'], {
    required_error: 'Please select a payment method',
  }),
  paymentProofImage: z.number().optional(), // Media ID after upload
  paymentProofText: z.string().max(50, 'Maximum 50 characters').optional(),
  studentNote: z.string().max(500, 'Maximum 500 characters').optional(),
})

export type AdmissionFormData = z.infer<typeof admissionSchema>

// Per-step validation schemas
export const step1Schema = admissionSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  gender: true,
  education: true,
  guardianPhone: true,
  cnic: true,
  dateOfBirth: true,
})

export const step2Schema = admissionSchema.pick({
  address: true,
})

export const step3Schema = admissionSchema.pick({
  department: true,
  course: true,
  preferredMedium: true,
})

export const step4Schema = admissionSchema.pick({
  totalFeePackage: true,
  remainingInstallments: true,
  firstPaymentAmount: true,
  payDate: true,
  paidMethod: true,
  paymentProofImage: true,
  paymentProofText: true,
  studentNote: true,
})
