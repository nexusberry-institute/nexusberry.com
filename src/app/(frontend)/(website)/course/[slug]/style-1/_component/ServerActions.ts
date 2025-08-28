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
}) {
  try {
    const payload = await getPayload({ config });

    // Find course by slug
    const courseRes = await payload.find({
      collection: 'web-courses',
      where: { slug: { equals: data.courseSlug } },
      limit: 1,
      pagination: false,
    });
    const course = courseRes?.docs?.[0];
    if (!course) {
      return { success: false, error: 'Course not found.' };
    }

    // Check for existing lead by mobile or email
    const leadRes = await payload.find({
      collection: 'leads',
      where: {
        or: [
          { mobile: { equals: data.mobile } },
          { email: { equals: data.email } },
        ],
      },
      limit: 1,
      pagination: false,
      depth: 2,
    });
    const lead = leadRes?.docs?.[0];

    if (lead) {
      // Check if already booked demo for this course
      const demoBookings = lead.courseDemoBookings || [];
      const alreadyBooked = demoBookings.some((booking: any) => {
        const courseId = typeof booking.course === 'object' ? booking.course.id : booking.course;
        return courseId === course.id;
      });
      if (alreadyBooked) {
        return { success: false, error: 'You have already booked a demo for this course.' };
      }
      // Add new demo booking
      await payload.update({
        collection: 'leads',
        id: lead.id,
        data: {
          courseDemoBookings: [
            ...demoBookings,
            { course: course.id, bookedAt: new Date().toISOString() },
          ],
        },
      });
      return { success: true, message: 'Demo booked successfully.' };
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
        courseDemoBookings: [
          { course: course.id, bookedAt: new Date().toISOString() },
        ],
      },
    });
    return { success: true, message: 'Demo booked successfully.' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
