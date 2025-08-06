import config from '@payload-config';
// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig, getPayload } from 'payload';


export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'slug',
    group: "Academic Operations",
    defaultColumns: ['student', 'completionState', 'training-course'],
  },
  access: {
    // create: checkAccess('enrollments', 'create'),
    // read: checkAccess('enrollments', 'read'),
    // update: checkAccess('enrollments', 'update'),
    // delete: checkAccess('enrollments', 'delete'),
  },
  hooks: {
    beforeDelete: [
      async ({ id, req: { payload } }) => {
        const { docs } = await payload.find({
          collection: 'fee-receipts',
          where: {
            enrollment: {
              equals: id
            }
          },
          depth: 0,
          pagination: false,
          select: {
          }
        })
        await payload.delete({
          collection: 'fee-receipts',
          where: {
            id: {
              in: docs.map(doc => doc.id)
            },
          }
        })
      }
    ],
    beforeChange: [
      async ({ req: { payload }, data, operation }) => {
        if (operation === "create" && data.discountCode) {
          const code = await payload.findByID({
            collection: "discount-codes",
            id: data.discountCode,
            select: {
              timesUsed: true
            }
          })

          await payload.update({
            collection: "discount-codes",
            id: code.id,
            data: {
              timesUsed: code.timesUsed ? code.timesUsed + 1 : 1
            }
          })
        }
      }
    ]
  },
  fields: [
    {
      type: "tabs",
      defaultValue: "Enrollment Details",
      tabs: [
        {
          label: "Enrollment Details",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "student",
                  type: "relationship",
                  relationTo: "students",
                  required: true
                },
                {
                  name: 'training-course',
                  type: 'relationship',
                  relationTo: 'training-courses',
                  hasMany: false,
                  required: true,
                  admin: {
                    allowCreate: false,
                  },
                },
              ]
            },
            {
              name: "slug",
              type: "text",
              required: true,
              admin: {
                readOnly: true,
                components: {
                  Field: {
                    path: "@/fields/EnrollmentSlug",
                  },
                }
              }
            },
            {
              name: "batchEnrollments",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "batch",
                      type: "relationship",
                      relationTo: "batches",
                      hasMany: false,
                      admin: {
                        allowCreate: false,
                      },
                      filterOptions: async ({ data }) => {

                        if (data["training-course"]) {

                          const payload = await getPayload({ config })

                          const course = await payload.findByID({
                            collection: "training-courses",
                            id: data["training-course"],
                            select: {
                              modules: true
                            },
                            depth: 0
                          })

                          return {
                            modules: {
                              in: course.modules
                            }
                          }
                        }

                        return true
                      }
                    },
                    {
                      name: 'modules',
                      type: 'relationship',
                      relationTo: 'modules',
                      hasMany: true,
                      admin: {
                        allowCreate: false,
                      },
                      filterOptions: async ({ data }) => {

                        if (data["training-course"]) {

                          const payload = await getPayload({ config })

                          const course = await payload.findByID({
                            collection: "training-courses",
                            id: data["training-course"],
                            select: {
                              modules: true
                            },
                            depth: 0
                          })

                          return {
                            id: {
                              in: course.modules
                            }
                          }
                        }

                        return true
                      }
                    },
                    {
                      name: "mode",
                      type: "select",
                      defaultValue: "HYBRID",
                      options: [
                        "ONLINE",
                        "PHYSICAL",
                        "HYBRID"
                      ]
                    },
                  ]
                }
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: "selectedPaymentPlan",
                  type: "relationship",
                  relationTo: "payment-plans",
                  filterOptions: ({ data }) => {
                    return {
                      "training-course": {
                        equals: data["training-course"]
                      }
                    }
                  },
                  hasMany: false,
                  required: true
                },
                {
                  name: "discountCode",
                  type: "relationship",
                  relationTo: "discount-codes",
                  hasMany: false,
                  filterOptions: ({ data }) => {
                    return {
                      "training-course": { equals: data["training-course"] },
                      "paymentPlan": { equals: data["selectedPaymentPlan"] },
                      isValid: { equals: true }
                    }
                  },
                }
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: 'admissionDate',
                  type: 'date',
                  defaultValue: () => new Date(),
                  // required: true,
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly",
                      displayFormat: "MMM dd, yyyy",
                    }
                  }
                },
                {
                  name: 'admissionFee',
                  type: 'number',
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    step: 1,
                  }
                },
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: "freezeDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly"
                    }
                  }
                },
                {
                  name: "unfreezeDate",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayOnly"
                    }
                  }
                },
              ]
            },
            {
              type: "row",
              fields: [
                {
                  name: "completionState",
                  type: "select",
                  defaultValue: "CONTINUE",
                  options: [
                    "CONTINUE",
                    "COMPLETED",
                    "LEFT",
                    "FREEZE"
                  ]
                },
                {
                  name: "certificateStatus",
                  type: "select",
                  defaultValue: "PENDING",
                  options: [
                    "ISSUED",
                    "PENDING",
                  ]
                },
                {
                  name: "isSuspended",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    style: {
                      paddingTop: "10px",
                      alignSelf: "center",
                    }
                  }
                },
              ]
            },
            {
              name: 'note',
              type: 'text',
            },
          ]
        },
        {
          label: "Fee Reciepts",
          fields: [
            {
              name: "relatedFeeReciepts",
              label: "Fee Reciepts of this Enrollment",
              type: "join",
              collection: "fee-receipts",
              on: "enrollment",
              defaultSort: "dueDate",
              admin: {
                defaultColumns: ["student", "amount", "dueDate", "payDate", "status", "verified"],
              }
            }
          ]
        }
      ]
    }
  ]
  // {
  //   name: "credit",
  //   type:"relationship",
  //   relationTo: "staff",
  // }
};