import { CollectionConfig } from "payload";

const generateUniqueCode = (): string => {
  const prefix = 'NEXUS';
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';

  // Generate a 6-character random string
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Add timestamp to ensure uniqueness
  const timestamp = new Date().getTime().toString(36).slice(-4);

  return `${prefix}-${result}${timestamp}`;
};

export const DiscountCodes: CollectionConfig = {
  slug: "discount-codes",
  admin: {
    useAsTitle: "code",
    description: "Manage discount codes for training courses",
    group: "Academic Structure"
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set usage_limit to 1 if user_email is provided
        if (data.user_email) {
          data.usage_limit = 1;
        }
        return data;
      }
    ],
    beforeRead: [
      ({ doc, req: { payload } }) => {
        // Compute is_valid based on usage and expiry
        if (doc.isValid) {
          const currentTime = new Date();
          const expiryTime = doc.expiryAt ? new Date(doc.expiryAt) : null;
          let shouldRemainValid = true;

          if (doc.usageLimit) {
            shouldRemainValid = doc.timesUsed < doc.usageLimit;
          } else {
            shouldRemainValid = expiryTime ? currentTime < expiryTime : true;
          }

          if (!shouldRemainValid) {
            payload.update({
              collection: "discount-codes",
              id: doc.id,
              data: {
                isValid: false
              }
            });
          }
        }
      }
    ]

  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      defaultValue: generateUniqueCode(),
      unique: true,
      admin: {
        description: "Unique discount code (e.g., SAVE20)"
      }
    },
    {
      name: "training-course",
      type: "relationship",
      relationTo: "training-courses",
      hasMany: false,
      required: true,
      admin: {
        description: "Link to the specific training course"
      }
    },
    {
      name: "paymentPlan",
      type: "relationship",
      relationTo: "payment-plans",
      filterOptions: ({ data }: any) => {
        return {
          "training-course": {
            equals: data["training-course"]
          }
        }
      },
      hasMany: false,
      required: true,
      admin: {
        description: "Link to the payment plan of the training Course (e.g., Lump Sum or Installment)"
      }
    },
    {
      type: "row",
      fields: [
        {
          name: "discountType",
          type: "select",
          options: [
            {
              label: "Percentage",
              value: "percentage"
            },
            {
              label: "Fixed Amount",
              value: "fixed"
            }
          ],
          required: true,
          defaultValue: "fixed",
          admin: {
            description: "Type of discount"
          }
        },
        {
          name: "discountValue",
          type: "number",
          required: true,
          admin: {
            description: "Discount value (e.g., 20% or Rs 20 based on the discount type). This will be applied to each installment if there is more than one."
          }
        },
      ]
    },
    {
      name: "usageLimit",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: {
        position: "sidebar",
        description: "Maximum number of times this code can be used. Set to 0 if there is no usage limit."
      }
    },
    {
      name: "timesUsed",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Tracks how many times the code has been used",
        readOnly: true
      }
    },
    {
      name: "expiryAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "Expiry date and time of the discount code",
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "HH:mm MMM d, yyyy"
        }
      }
    },
    {
      name: "isValid",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Whether the code is currently valid (Will be auto changed, based on usage limit and time used)",
        readOnly: true
      }
    },
    {
      name: "userEmail",
      type: "email",
      admin: {
        description: "Email of the specific user eligible for this discount code (this will sets usage_limit to 1)"
      }
    }
  ]
}
