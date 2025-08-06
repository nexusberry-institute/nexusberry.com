"use server"

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function getUserEnrolledCourses() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  try {
    const { docs } = await payload.find({
      collection: "enrollments",
      where: {
        'student.user': {
          equals: user?.id || 0,
        },
      },
      select: {
        batchEnrollments: {
          id: true,
          batch: true,
          modules: true,
          mode: true,
        },
        completionState: true,
        isSuspended: true,
        relatedFeeReciepts: true,
        "training-course": true
      },
      populate: {
        batches: {
          active: true,
          startDate: true,
          endDate: true,
          duration: true,
          slug: true,
          batchTimeTable: true,
        },
        "fee-receipts": {
          status: true,
          dueDate: true,
        },
        "training-courses": {
          title: true,
        },
        modules: {
          title: true,
        }
      },
      joins: {
        relatedFeeReciepts: {
          where: {
            or: [
              {
                status: {
                  equals: "RECEIVED",
                },
                verified: {
                  equals: false
                }
              },
              {
                status: {
                  equals: "PENDING",
                }
              }
            ]
          }
        }
      },
      sort: '-createdAt',
      pagination: false,
      depth: 1,
    })

    return docs.map((enrollment) => {
      return {
        id: typeof enrollment["training-course"] === "number" ? enrollment["training-course"] : enrollment["training-course"].id,
        title: typeof enrollment["training-course"] === "number" ? "Training Course" : enrollment["training-course"].title,
        enrollmentId: enrollment.id,
        enrollmentStatus: enrollment.completionState,
        isSuspended: enrollment.isSuspended,
        batchEnrollments: enrollment.batchEnrollments?.map((batchEnrollment) => {
          if (typeof batchEnrollment.batch === "number") return null;
          return {
            id: batchEnrollment.id,
            batch: {
              ...batchEnrollment.batch,
              batchTimeTable: batchEnrollment.batch?.batchTimeTable?.docs
            },
            mode: batchEnrollment.mode,
            modules: batchEnrollment.modules?.map(module => typeof module === "number" ? module : module.id),
          }
        }),
        relatedFeeReciepts: enrollment.relatedFeeReciepts?.docs?.map((receipt) => {
          if (typeof receipt === "number") return null;
          return {
            id: receipt.id,
            status: receipt.status,
            dueDate: receipt.dueDate
          }
        }),
      };
    });

  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error;
  }
}

