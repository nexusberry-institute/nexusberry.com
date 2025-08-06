import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";
import { revalidateDepartments, revalidateDelete } from "./hooks/revalidateDepartments";
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";

export const Departments: CollectionConfig = {
  slug: "departments",
  defaultSort: "orderInDepartments",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [
      revalidateDepartments
    ],
    afterDelete: [
      revalidateDelete
    ]
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Department",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            ...slugField(),
            {
              name: "orderInDepartments",
              type: "number",
              // required: true,
              defaultValue: 1,
              min: 1,
            },
            {
              name: "description",
              type: "text",
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            }
          ]
        },
        {
          label: "SEO",
          fields: [
            {
              name: 'meta',
              label: 'SEO',
              type: "group",
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),

                MetaDescriptionField({}),
                PreviewField({
                  // if the `generateUrl` function is configured
                  hasGenerateFn: true,

                  // field paths to match the target field for data
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ]
        },
        {
          label: "Related Courses",
          fields: [
            {
              name: "relatedCourses",
              type: "join",
              collection: "web-courses",
              on: "department",
              maxDepth: 2,
            }
          ]
        }
      ]
    }
  ]
};