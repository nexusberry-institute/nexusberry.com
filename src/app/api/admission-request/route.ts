import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate user from cookie
    const reqHeaders = await nextHeaders()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit an admission request. Please login with Google first.' },
        { status: 401 },
      )
    }

    const body = await request.json()

    // Validate required fields
    const { fullName, email, phoneNumber, course } = body
    if (!fullName || !email || !phoneNumber || !course) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, phoneNumber, course' },
        { status: 400 },
      )
    }

    // Check for duplicate: same email + same course within 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const existing = await payload.find({
      collection: 'admission-requests',
      where: {
        and: [
          { email: { equals: email } },
          { course: { equals: course } },
          { createdAt: { greater_than: thirtyDaysAgo.toISOString() } },
          { status: { not_in: ['rejected'] } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        {
          error:
            'An admission request for this course was already submitted recently. Our team will contact you soon.',
        },
        { status: 409 },
      )
    }

    // Auto-link to existing Lead by email or phone
    let leadId: number | undefined
    const leadSearch = await payload.find({
      collection: 'leads',
      where: {
        or: [
          { email: { equals: email } },
          { mobile: { equals: phoneNumber } },
        ],
      },
      limit: 1,
      depth: 0,
    })
    const firstLead = leadSearch.docs[0]
    if (firstLead) {
      leadId = firstLead.id as number
    }

    // Create admission request
    const admissionRequest = await payload.create({
      collection: 'admission-requests',
      data: {
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        guardianPhone: body.guardianPhone || undefined,
        cnic: body.cnic || undefined,
        gender: body.gender || undefined,
        education: body.education || undefined,
        dateOfBirth: body.dateOfBirth || undefined,
        address: body.address || undefined,
        course: body.course,
        department: body.department || undefined,
        preferredMedium: body.preferredMedium || undefined,
        firstPaymentAmount: body.firstPaymentAmount || undefined,
        payDate: body.payDate || undefined,
        paidMethod: body.paidMethod || undefined,
        paymentProofImage: body.paymentProofImage || undefined,
        paymentProofText: body.paymentProofText || undefined,
        studentNote: body.studentNote || undefined,
        lead: leadId || undefined,
        submittedBy: user.id,
        status: 'pending',
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message:
        'Your admission request has been submitted successfully. Our team will review it and contact you soon.',
      id: admissionRequest.id,
    })
  } catch (error: unknown) {
    console.error('Admission request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit admission request. Please try again.' },
      { status: 500 },
    )
  }
}
