"use server"

import { getPayload } from "payload"
import config from "@/payload.config"
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"

// Improved getTodayClasses function
export const getTodayClasses = async (headers: ReadonlyHeaders) => {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })

    if (!user) {
      throw new Error("Authentication Failed! Try Logging In Again or Refresh the page")
    }

    // Fetch enrollments with clear dues
    const { docs: enrollments } = await payload.find({
      collection: "enrollments",
      pagination: false,
      depth: 0,
      select: {
        "batchEnrollments": true,
        relatedFeeReciepts: true
      },
      where: {
        "student.user": { equals: user.id },
        isSuspended: { not_equals: true },
        completionState: { equals: "CONTINUE" },
        "batchEnrollments.mode": { equals: "ONLINE" }
      },
      joins: {
        relatedFeeReciepts: {
          where: {
            dueDate: { less_than_equal: Date.now() },
            status: { not_equals: "RECEIVED" }
          }
        }
      }
    })

    // Process enrollments to get valid batches
    const validBatchIds = new Set<number>()
    const enrollmentMap = new Map<number, number>() // batchId -> enrollmentId

    for (const enrollment of enrollments) {
      // Skip if has overdue fees
      if (enrollment.relatedFeeReciepts?.docs?.length) continue

      // Process all batch enrollments in one go
      enrollment.batchEnrollments?.forEach(be => {
        if (be.batch && be.mode === 'ONLINE') {
          const batchId = typeof be.batch === "number" ? be.batch : be.batch.id
          validBatchIds.add(batchId)
          enrollmentMap.set(batchId, enrollment.id)
        }
      })
    }

    // Fetch class links
    const { docs: classLinks } = await payload.find({
      collection: "attendance",
      where: {
        and: [
          { visible: { equals: true } },
          { expiry: { greater_than_equal: new Date() } },
          {
            or: [
              { 'users.id': { equals: user.id } },
              { 'batches.id': { in: Array.from(validBatchIds) } }
            ]
          }
        ]
      },
      select: {
        onlineClassLink: true,
        batches: true,
        expiry: true,
        users: true,
        type: true,
        updatedAt: true
      },
      populate: {
        batches: {
          slug: true,
          "training-courses": true
        },
        "training-courses": {
          title: true
        },
        users: {
        }
      },
      pagination: false,
      limit: 100,
      depth: 2
    })

    // Process class links to create optimized view data
    const processedClasses = []
    // Create a Set for tracking which batch-class combinations we've already processed
    // This prevents duplicate cards without nested loops
    const processedCombinations = new Set()

    for (const classItem of classLinks) {
      const isUserDirectlyIncluded = classItem.users?.some(u =>
        typeof u === 'object' ? u.id === user.id : u === user.id
      )

      // Process all batches in a single loop with early continDue
      for (const batch of classItem.batches || []) {
        const batchId = typeof batch === 'object' ? batch.id : batch

        // Create a unique key for this class-batch combination
        const combinationKey = `${classItem.id}-${batchId}`

        // Skip if we've already processed this combination
        if (processedCombinations.has(combinationKey)) continue

        // Add to processed set
        processedCombinations.add(combinationKey)

        const isEnrolledInBatch = validBatchIds.has(batchId)

        // Only add if user is directly included OR enrolled in this batch
        if (isUserDirectlyIncluded || isEnrolledInBatch) {
          processedClasses.push({
            id: classItem.id,
            onlineClassLink: classItem.onlineClassLink,
            type: classItem.type,
            expiry: classItem.expiry,
            updatedAt: classItem.updatedAt,
            batch,
            enrollmentId: isEnrolledInBatch ? enrollmentMap.get(batchId) : null
          })
        }
      }

      // Special case: user is directly included but not enrolled in any batches
      if (isUserDirectlyIncluded &&
        !classItem.batches?.some(b => validBatchIds.has(typeof b === 'object' ? b.id : b)) &&
        classItem.batches?.length) {

        const firstBatch = classItem.batches[0]
        const firstBatchId = typeof firstBatch === 'object' ? firstBatch.id : firstBatch
        const combinationKey = `${classItem.id}-${firstBatchId}`

        // Only add if not already processed
        if (!processedCombinations.has(combinationKey)) {
          processedCombinations.add(combinationKey)
          processedClasses.push({
            id: classItem.id,
            onlineClassLink: classItem.onlineClassLink,
            type: classItem.type,
            expiry: classItem.expiry,
            updatedAt: classItem.updatedAt,
            batch: firstBatch,
            enrollmentId: null
          })
        }
      }
    }

    return {
      userId: user.id,
      classes: processedClasses
    }
  } catch (error) {
    console.error(error)
    throw new Error("Error fetching today's classes. Please try again later.")
  }
}

// Parallel Data Fetching
// export const getTodayClasses = async () => {
//   try {
//     console.time("enrollment")
//     const payload = await getPayload({ config })
//     const { user } = await payload.auth({ headers: await headers() })

//     const classLinkQuery = payload.find({
//       collection: "class-links",
//       where: {
//         visible: {
//           equals: true
//         },
//         expiry: {
//           greater_than_equal: Date.now()
//         },
//       },
//       populate: {
//         batches: {
//           slug: true,
//           "training-courses": true
//         },
//         "training-courses": {
//           title: true
//         },
//         users: {

//         }
//       },
//       pagination: false,
//       limit: 100,
//       depth: 2
//     })

//     //for checking fees & suspend statusof enrollments
//     const enrollmentsQuery = payload.find({
//       collection: "enrollments",
//       pagination: false,
//       depth: 0,
//       select: {
//         "batchEnrollments": true,
//         relatedFeeReciepts: true
//       },
//       where: {
//         "student.user": {
//           equals: user?.id
//         },
//         isSuspended: {
//           not_equals: true
//         },
//         completionState: {
//           equals: "CONTINUE"
//         },
//         "batchEnrollments.mode": {
//           equals: "ONLINE"
//         }
//       },
//       joins: {
//         relatedFeeReciepts: {
//           where: {
//             dueDate: {
//               less_than_equal: Date.now()
//             },
//             status: {
//               not_equals: "RECEIVED"
//             }
//           }
//         }
//       }
//     })

//     const [paginatedEnrollments, paginatedClassLinks] = await Promise.all([enrollmentsQuery, classLinkQuery])

//     const batchesId = paginatedEnrollments.docs
//       // Filter those enrollments whose has overdue fees (relatedFeeReceipt has docs)
//       .filter(enrollment => !enrollment.relatedFeeReciepts?.docs?.length)
//       // Flat map to get only batchesID
//       .flatMap(doc => doc.batchEnrollments
//         ?.map(bE => bE.batch)) as number[]

//     const classLinks = paginatedClassLinks.docs as TClass[]

//     const filteredClassLinks = classLinks.map((classLink => {
//       if (classLink.users && classLink.users.some(obj => obj.id === user?.id)) return classLink
//       if (classLink.batches) {
//         const filteredBatches = classLink.batches.filter(batch => batchesId.includes(batch.id))
//         if (filteredBatches.length) {
//           return {
//             ...classLink,
//             batches: filteredBatches
//           }
//         }
//       }
//     })).filter(cl => cl !== undefined)

//     console.timeEnd("enrollment")
//     return filteredClassLinks

//   } catch (error) {
//     console.error(error)
//     throw new Error("Error fetching today's classes. Please try again later.")
//   }
// }
