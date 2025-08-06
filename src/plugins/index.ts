import { s3Storage } from '@payloadcms/storage-s3';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
// import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
//   return doc?.title ? `${doc.title} | NexusBerry` : 'NexusBerry Training & Solutions'
// }

// const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
//   const url = getServerSideURL()
//   return doc?.slug ? `${url}/${doc.slug}` : url
// }

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'departments', 'web-courses'],
    overrides: {
      // @ts-expect-error
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
  }),
  seoPlugin({
    generateTitle: ({ doc }) => {
      return doc?.title ? `${doc.title} | NexusBerry` : 'NexusBerry Training & Solutions'
    },
    generateDescription: (_) => {
      return "Best Selling Course at NexusBerry Training & Solutions"
    },
    generateURL: ({ doc }) => {
      const url = getServerSideURL()
      return doc?.slug ? `${url}/${doc.slug}` : url
    },
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'keywords',
        type: 'textarea',
      },
      {
        name: 'jsonld',
        type: 'json',
      },
      {
        name: 'canonical',
        type: 'text',
      },
      {
        name: 'ogTitle',
        type: 'text',
      },
      {
        name: 'ogDescription',
        type: 'textarea',
      }
    ]
  }),


  formBuilderPlugin({
    fields: {
      text: true,
      textarea: true,
      email: true,
      checkbox: true,
      number: true,
      message: true,
      select: true,
      country: true,
      state: true,
      date: true,
      fileUpload: true,
      // Enable/disable as needed
    },
    redirectRelationships: ['pages'], // or whatever you use
    defaultToEmail: 'admin@nexusberry.com',
    beforeEmail: (emailToSend) => {
      // console.log('📤 Sending email:', emailToSend);
      return emailToSend;
    },

    // 👇 Customize the admin group for sidebar label
    formOverrides: {
      admin: {
        group: 'Student Form',
      },
      slug: 'forms',
      labels: {
        singular: 'Certificate Form',
        plural: 'Certificate Forms',
      },

      // ✅ Correct way to override fields
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          admin: {
            position: 'sidebar',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }) => {
                if (!value && data?.title) {
                  return data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                }
                return value;
              },
            ],
          },
        }
      ],
    },
    // ✅ Overrides for the Form Submissions collection
    formSubmissionOverrides: {
      admin: {
        group: 'Student Form',
      },
      slug: 'form-submissions',
      labels: {
        singular: 'Submission',
        plural: 'Submissions',
      },
    },

    // ✅ Optional: Add email hooks for debugging


  }),

  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  s3Storage({ // Supabase Storage
    collections: {
      media: {
        prefix: 'media',
      }
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      forcePathStyle: true, // Important for using Supabase
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
      endpoint: process.env.S3_ENDPOINT || '',
    },
  }),
]
