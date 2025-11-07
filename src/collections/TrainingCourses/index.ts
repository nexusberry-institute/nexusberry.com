// import { checkAccess } from "@/access/accessControl";
import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const TrainingCourses: CollectionConfig = {
  slug: "training-courses",
  admin: {
    useAsTitle: "title",
    group: "Classwork"
  },
  access: {
    // create: checkAccess('courses', 'create'),
    // read: checkAccess('courses', 'read'),
    // update: checkAccess('courses', 'update'),
    // delete: checkAccess('courses', 'delete'),
  },
  fields: [
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      admin: {
        position: "sidebar",
      },
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        }
      ]
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField("title", {
      slugOverrides: {
        required: true,
        admin: {
          placeholder: "Will be created automatically from title",
        }
      }
    }),
    {
      name: "description",
      type: "text",
      required: false,
    },
    {
      name: "modules",
      type: "relationship",
      relationTo: "modules",
      hasMany: true,
    },
    {
      name: "departments",
      type: "relationship",
      relationTo: "departments",
      hasMany: true
    },
    {
      name: "fullPrice",
      type: "number",
      required: true,
      min: 0,
      admin: {
        step: 500,
        description: "Full price of the course",
        position: "sidebar",
      }
    },
    {
      name: "relatedPaymentPlans",
      type: "join",
      collection: "payment-plans",
      on: "training-course",
      defaultSort: "id",
      orderable: true,
    }
  ],
};