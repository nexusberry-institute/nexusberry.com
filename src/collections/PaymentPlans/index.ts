import { CollectionConfig, ValidationError } from "payload";

export const PaymentPlans: CollectionConfig = {
  slug: "payment-plans",
  admin: {
    useAsTitle: "name",
    group: "Academic Structure"
  },
  hooks: {
    beforeChange: [
      // Throw validation Error if total fees is not equal to sum of installments
      ({ data }) => {
        if (data.installments && data.installments.length) {
          const totalInstallment = data.installments.reduce((acc: number, installment: { amount: number }) => {
            return acc + (installment.amount || 0);
          }, 0);
          if (totalInstallment !== data.totalPrice) {
            throw new ValidationError({
              errors: [
                {
                  label: "installments",
                  message: "Sum of Installments is not equal to course full price",
                  path: "installments"
                }
              ]
            })
          }
        }
      }
    ]
  },
  fields: [
    {
      name: "training-course",
      type: "relationship",
      relationTo: "training-courses",
      hasMany: false,
      required: true
    },
    {
      name: "totalPrice",
      type: "number",
      virtual: true,
      admin: {
        readOnly: true,
        disableListColumn: true,
        description: "Full Price of selected course",
        components: {
          Field: {
            path: "@/fields/PaymentPlanFields/TotalPrice"
          }
        }
      }
    },
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "is_popular",
          type: "checkbox",
          defaultValue: false,
          admin: {
            description: "Mark one of the payment plans as popular",
          }
        }
      ]
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "SumOfInstallments",
      type: "ui",
      admin: {
        disableListColumn: true,
        components: {
          Field: {
            path: '@/fields/PaymentPlanFields/SumOfInstallments'
          }
        }
      }
    },
    {
      name: "installments",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: "amount",
          type: "number",
          required: true,
          min: 0,
          admin: {
            step: 500,
          }
        },
        {
          name: "due_after_days",
          type: "number",
          defaultValue: 30,
          admin: {
            step: 1,
            description: "Number of days for next Due Date"
          }
        }
      ]
    },
  ]
}