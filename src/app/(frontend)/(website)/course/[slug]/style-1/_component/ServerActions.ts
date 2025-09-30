'use server'

import { getPayload } from 'payload';
import config from '@payload-config';

export default async function CreateCourseDemoBooking(data: {
  name: string;
  mobile: string;
  email: string;
  education: string;
  job_info: string;
  notes?: string;
  courseSlug: string;
  courseId: number
}) {
  try {
    const payload = await getPayload({ config });

    // Check for existing lead by mobile or email
    const leadRes = await payload.find({
      collection: 'leads',
      where: {
        and: [
          { mobile: { equals: data.mobile } },
          { email: { equals: data.email } },
        ],
      },
      limit: 1,
      pagination: false,
      select: {
        courseDemoBookings: true
      },
      depth: 2,
    });
    const lead = leadRes.docs[0] || null;

    if (lead) {
      // Add new demo booking
      await payload.update({
        collection: 'leads',
        id: lead.id,
        data: {
          courseDemoBookings: [
            ...lead.courseDemoBookings || [],
            { course: data.courseId, bookedAt: new Date().toISOString() },
          ],
        },
      });
      return { success: true, message: 'Demo booked successfully!' };
    }

    // Create new lead with demo booking
    await payload.create({
      collection: 'leads',
      data: {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        education: data.education,
        job_info: data.job_info,
        notes: data.notes,
        source: `course-page-course-${data.courseId}-demo-booking`,
        courseDemoBookings: [
          { course: data.courseId, bookedAt: new Date().toISOString() },
        ],
      },
    });
    return { success: true, message: 'Demo booked successfully!' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
