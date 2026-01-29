import { revalidateCourses, revalidateDelete } from './hooks/revalidateCourses';
import { slugField } from "@/fields/slug";
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields';
import { AlignFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, UnorderedListFeature, IndentFeature, ChecklistFeature, BlockquoteFeature } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const WebCourses: CollectionConfig = {
  slug: "web-courses",
  admin: {
    useAsTitle: "title",
    listSearchableFields: ["title", "slug"],
  },
  hooks: {
    // afterChange: [revalidateCourses],
    afterDelete: [revalidateDelete]
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Course Details",
          fields: [
            {
              name: "title",
              type: "text",
              required: true
            },
            ...slugField("title", {
              slugOverrides: {
                required: true,
                // unique: true,
                // index: true
              }
            }),
            {
              name: "subTitle",
              type: 'textarea',
              required: true

            },
            {
              name: "learningOutcomes",
              type: "richText",
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    HorizontalRuleFeature(),
                    AlignFeature(),
                  ]
                },
              }),
            },
            {
              name: "description",
              type: "richText",
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    UnorderedListFeature(),
                    HorizontalRuleFeature(),
                    AlignFeature(),
                  ]
                },
              }),
            },
            {
              name: "modules",
              label: "Modules",
              type: "array",
              fields: [
                {
                  name: "heading",
                  type: "text",
                },
                {
                  name: "content",
                  type: "richText",
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        UnorderedListFeature(),
                        HorizontalRuleFeature(),
                        AlignFeature(),
                        IndentFeature(),
                        ChecklistFeature(),
                        BlockquoteFeature(),
                      ]
                    },
                  }),
                }
              ]
            },
            {
              name: "duration",
              type: "number",
              min: 1,
              admin: {
                description: "Duration in weeks",
                step: 1
              }
            },
            {
              name: "price",
              type: "number",
              min: 0,
              admin: {
                position: "sidebar",
                description: "Actual Price"
              }
            },
            {
              name: "crossPrice",
              type: "number",
              min: 0,
              admin: {
                position: "sidebar",
                description: "Crossed Price"
              }
            },
            {
              name: "department",
              type: "relationship",
              relationTo: "departments",
              admin: {
                position: "sidebar",
                allowCreate: false,
              }
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "difficultyLevel",
              type: "select",
              options: ["Beginner", "Intermediate", "Advanced"],
              defaultValue: "Beginner"
            },
            {
              name: "renderStyle",
              type: "select",
              options: [
                "style-1",
                "style-2",
                "style-3",
              ],
              defaultValue: "style-1"
            },
            {
              name: "courseFormat",
              type: "select",
              options: ["short", "medium", "long"],
              defaultValue: "medium"
            },
            {
              name: "totalLectures",
              type: "number",
              min: 1
            },
            {
              name: "orderInCourses",
              type: "number",
              min: 1
            },

            {
              name: "projects",
              type: "number",
              min: 1
            },
            {
              name: "instructor",
              type: "relationship",
              relationTo: "instructors"
            },
            {
              name: "FAQs",
              type: "array",
              fields: [
                {
                  name: "question",
                  type: "text",
                  required: true
                },
                {
                  name: "answer",
                  type: "text",
                  required: true
                }
              ]
            }
          ]
        },
        {
          label: 'Events',
          fields: [
            {
              name: 'events',
              label: 'Events',
              type: 'join',
              collection: 'events',
              on: 'courses',
              admin: {
                allowCreate: false,
                description: "See all events that include this course",
              },
              defaultLimit: 10,
              defaultSort: '-createdAt',
              maxDepth: 2,
            },
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

                // Canonical URL field from SEO plugin
                {
                  name: 'canonical',
                  type: 'text',
                  label: 'Canonical URL',
                  admin: {
                    description: 'The canonical URL for this page. Leave blank to use the default URL.',
                    placeholder: 'https://nexusberry.com/course/course-slug',
                  },
                },
                {
                  name: 'keywords',
                  type: 'textarea',
                  label: 'Keywords',
                  admin: {
                    description: 'Add relevant keywords separated by commas',
                    placeholder: 'keyword1, keyword2, keyword3',
                  },
                },
                {
                  name: 'jsonld',
                  type: 'json',
                  label: 'JSON-LD Structured Data',
                  admin: {
                    description: 'Add structured data for rich snippets',
                  },
                },

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
        }
      ]
    }
  ]
}

// /////////////////////Final Selection
// Direct Fields
// title
// subTitle
// slug

// Direct Relationship Fields
// Departments (hasMany:true)
// Categories (hasMany:true)

// Direct RichText Fields
// learningOutcomes: RichText
// Description: RichText

// Blocks
// Course FlipBook Block
// Course Success Stories Block
// Course Features Block
// Institute Features Block
// Course Curriculum Block
// Course Reviews Block
// Course Projects Block
// Course Instructors Block
// Course FAQ Block
// Course Hero Block
// Course CTA Block
// Course Inline Form Block
// Course Announcement Block
// Tech Logos Block
// Career Support Block
// Certificate Block
// Fee Structure Block
// Related Courses Block
// Breadcumb Block
// Pre-Requisites Block

// Plugins
// SEO plugin
// Redirects plugin



// //////////////////////Direct Fields in strapi course
// id
// title
// subTitle
// slug
// price
// discountPrice
// longDescription: RichText
// shortDescription: RichText
// modules: RichText
// Link": null,
// "difficulytyLevel": null,
// "duration": 4,
// "position": 8,
// "nick": "MEAN Stack",
// "display": null,
// "videoLink": null,
// "showInHome": null
// "createdAt": "2023-04-24T18:47:01.445Z",
// "updatedAt": "2023-08-18T11:38:22.606Z",
// "publishedAt"
// /////////////////////////////////////Relationship Fields in strapi course
// Faqs: Array
// image
// seo
// brochure: Downloadable PDF
// categories (department): Array
// collection: Array
// RelatedCourses (5)
// Specs (Features): Array
// Alumni
// -----------------------------------------------------------------------

