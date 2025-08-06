import { PayloadRequest } from "payload"

export const createAttendanceDetails = async ({ doc, operation, req }: {
  doc: any,
  operation: string,
  req: PayloadRequest
}) => {

  if (operation === "create") {

    try {

      const enrollments = await req.payload.find({
        collection: "enrollments",
        pagination: false,
        depth: 0,
        where: {
          'batchEnrollments.batch': {
            equals: doc.batch
          }
        }
      })

      enrollments.docs.forEach(enrollment => {
        req.payload.create({
          collection: "attendance-details",
          data: {
            attendance: doc.id,
            enrollment: enrollment.id,
            medium: doc.medium === "ONLINE" ? "ONLINE" : "PHYSICAL",
            status: "ABSENT"
          }
        })
      })
    } catch (error) {
      console.log(error)
    }

    return doc
  }
}