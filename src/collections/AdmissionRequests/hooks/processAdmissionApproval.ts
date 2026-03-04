import type { CollectionAfterChangeHook } from 'payload'
import type { User } from '@/payload-types'
import crypto from 'crypto'

type UserRole = NonNullable<User['roles']>[number]

export const processAdmissionApproval: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  // Only fire when status transitions TO 'approved'
  if (doc.status !== 'approved') return doc
  if (
    previousDoc?.status === 'approved' ||
    previousDoc?.status === 'processed'
  )
    return doc

  // Validate required fields before processing
  if (!doc.assignedBatch) {
    await req.payload.update({
      collection: 'admission-requests',
      id: doc.id,
      data: {
        status: 'reviewing',
        processingError: 'Cannot approve: no batch assigned.',
      },
      overrideAccess: true,
      req,
    })
    return doc
  }

  if (!doc.installments || doc.installments.length === 0) {
    await req.payload.update({
      collection: 'admission-requests',
      id: doc.id,
      data: {
        status: 'reviewing',
        processingError: 'Cannot approve: no installment plan defined.',
      },
      overrideAccess: true,
      req,
    })
    return doc
  }

  try {
    // ============ STEP 1: Find or Create User ============
    let userId: number
    let tempPassword: string | undefined

    // Check submittedBy first (Google login user)
    const submittedById =
      typeof doc.submittedBy === 'object'
        ? doc.submittedBy?.id
        : doc.submittedBy

    if (submittedById) {
      userId = submittedById

      // Ensure 'student' role is present
      const existingUser = await req.payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0,
        req,
      })

      const currentRoles = (existingUser.roles ?? []) as UserRole[]
      if (!currentRoles.includes('student')) {
        const updatedRoles = currentRoles.filter(r => r !== 'authenticated')
        updatedRoles.push('student')
        await req.payload.update({
          collection: 'users',
          id: userId,
          data: {
            roles: updatedRoles as UserRole[],
          },
          overrideAccess: true,
          req,
        })
      }
    } else {
      // No submittedBy — staff-created request. Find or create user by email.
      const existingUsers = await req.payload.find({
        collection: 'users',
        where: { email: { equals: doc.email } },
        limit: 1,
        depth: 0,
        req,
      })

      const firstUser = existingUsers.docs[0]
      if (firstUser) {
        userId = firstUser.id as number

        const currentRoles = (firstUser.roles ?? []) as UserRole[]
        if (!currentRoles.includes('student')) {
          const updatedRoles = currentRoles.filter(r => r !== 'authenticated')
          updatedRoles.push('student')
          await req.payload.update({
            collection: 'users',
            id: userId,
            data: {
              roles: updatedRoles as UserRole[],
            },
            overrideAccess: true,
            req,
          })
        }
      } else {
        // Create new user with temp password
        tempPassword = generateTempPassword()
        const newUser = await req.payload.create({
          collection: 'users',
          data: {
            email: doc.email,
            password: tempPassword,
            roles: ['student'],
            _verified: true,
          },
          overrideAccess: true,
          req,
        })
        userId = newUser.id as number
      }
    }

    // ============ STEP 2: Find or Create Student ============
    let studentId: number

    const existingStudents = await req.payload.find({
      collection: 'students',
      where: { user: { equals: userId } },
      limit: 1,
      depth: 0,
      req,
    })

    const firstStudent = existingStudents.docs[0]
    if (firstStudent) {
      studentId = firstStudent.id as number
    } else {
      const newStudent = await req.payload.create({
        collection: 'students',
        data: {
          user: userId,
          fullName: doc.fullName,
          fatherName: doc.fatherName || undefined,
          phoneNumber: doc.phoneNumber || undefined,
          cnic: doc.cnic || undefined,
          guardianPhone: doc.guardianPhone || undefined,
          education: doc.education || undefined,
          gender: doc.gender || undefined,
          dateOfBirth: doc.dateOfBirth || undefined,
          address: {
            homeAddress: doc.address?.homeAddress || undefined,
            city: doc.address?.city || undefined,
            province: doc.address?.province || undefined,
            country: doc.address?.country || undefined,
          },
          status: 'active',
          admissionDate: new Date().toISOString(),
        },
        overrideAccess: true,
        req,
      })
      studentId = newStudent.id as number
      // trackNewStudentAdmission fires automatically via Students afterChange hook
    }

    // ============ STEP 3: Create Enrollment ============
    const batchId =
      typeof doc.assignedBatch === 'object'
        ? doc.assignedBatch.id
        : doc.assignedBatch

    let enrollmentId: number

    try {
      const enrollment = await req.payload.create({
        collection: 'enrollments',
        data: {
          student: studentId,
          batch: batchId,
          mode: doc.enrollmentMode || doc.preferredMedium || undefined,
          status: 'active',
          admissionDate: new Date().toISOString(),
          note: `Created from admission request #${doc.id}`,
        },
        overrideAccess: true,
        req,
      })
      enrollmentId = enrollment.id as number
    } catch (err: unknown) {
      // Handle duplicate enrollment gracefully
      const errorMessage =
        err instanceof Error ? err.message : String(err)
      if (errorMessage.includes('already enrolled')) {
        const existing = await req.payload.find({
          collection: 'enrollments',
          where: {
            and: [
              { student: { equals: studentId } },
              { batch: { equals: batchId } },
            ],
          },
          limit: 1,
          depth: 0,
          req,
        })
        const existingEnrollment = existing.docs[0]
        if (existingEnrollment) {
          enrollmentId = existingEnrollment.id as number
        } else {
          throw err
        }
      } else {
        throw err
      }
    }

    // ============ STEP 4: Create FeeReceipts ============
    for (let i = 0; i < doc.installments.length; i++) {
      const installment = doc.installments[i]
      const isFirst = i === 0

      await req.payload.create({
        collection: 'fee-receipts',
        data: {
          student: studentId,
          enrollment: enrollmentId,
          installmentNumber: i + 1,
          admissionRequest: doc.id,
          amount: installment.amount,
          dueDate: installment.dueDate,
          status: installment.status || (isFirst ? 'RECEIVED' : 'PENDING'),
          paidMethod:
            installment.paidMethod || doc.paidMethod || 'BANK',
          payDate:
            (installment.status === 'RECEIVED' || isFirst)
              ? new Date().toISOString()
              : undefined,
          verified: isFirst,
          proofImage: isFirst
            ? (typeof doc.paymentProofImage === 'object'
                ? doc.paymentProofImage?.id
                : doc.paymentProofImage)
            : undefined,
          proofText: isFirst ? doc.paymentProofText : undefined,
          note: `Installment ${i + 1} — Admission Request #${doc.id}`,
        },
        overrideAccess: true,
        req,
      })
    }

    // ============ STEP 5: Update Lead (if linked) ============
    if (doc.lead) {
      const leadId =
        typeof doc.lead === 'object' ? doc.lead.id : doc.lead
      await req.payload.update({
        collection: 'leads',
        id: leadId,
        data: {
          stage: 'ENROLLED',
        },
        overrideAccess: true,
        req,
      })
    }

    // ============ STEP 6: Mark as Processed ============
    await req.payload.update({
      collection: 'admission-requests',
      id: doc.id,
      data: {
        status: 'processed',
        createdStudent: studentId,
        createdEnrollment: enrollmentId,
        processedAt: new Date().toISOString(),
        processingError: '',
        ...(tempPassword ? { tempPassword } : {}),
      },
      overrideAccess: true,
      req,
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Admission approval processing failed:', error)
    await req.payload.update({
      collection: 'admission-requests',
      id: doc.id,
      data: {
        processingError: `Processing failed: ${errorMessage}. Previously created records may exist — check Users, Students, Enrollments manually.`,
      },
      overrideAccess: true,
      req,
    })
  }

  return doc
}

function generateTempPassword(): string {
  return crypto.randomBytes(6).toString('base64url') + '!A1'
}
