import { z } from 'zod'

export const admissionSchema = z.object({
  // Step 1: Personal Details
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  guardianPhone: z.string().optional(),
  cnic: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  education: z.string().optional(),
  dateOfBirth: z.string().optional(),

  // Step 2: Address
  address: z.object({
    homeAddress: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    province: z.string().optional(),
    country: z.string().optional(),
  }),

  // Step 3: Course Selection
  course: z.number({ required_error: 'Please select a course' }),
  preferredMedium: z.enum(['ONLINE', 'PHYSICAL', 'HYBRID']).optional(),

  // Step 4: Payment Details
  firstPaymentAmount: z.number().min(0).optional(),
  paidMethod: z.enum(['BANK', 'CASH', 'JAZZCASH', 'EASYPAISA']).optional(),
  paymentProofImage: z.number().optional(), // Media ID after upload
  paymentProofText: z.string().optional(),
  studentNote: z.string().optional(),
})

export type AdmissionFormData = z.infer<typeof admissionSchema>

// Per-step validation schemas
export const step1Schema = admissionSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  guardianPhone: true,
  cnic: true,
  gender: true,
  education: true,
  dateOfBirth: true,
})

export const step2Schema = admissionSchema.pick({
  address: true,
})

export const step3Schema = admissionSchema.pick({
  course: true,
  preferredMedium: true,
})

export const step4Schema = admissionSchema.pick({
  firstPaymentAmount: true,
  paidMethod: true,
  paymentProofImage: true,
  paymentProofText: true,
  studentNote: true,
})
