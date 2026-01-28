import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
// import { s3Storage } from '@payloadcms/storage-s3';
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
import { mcpPlugin } from '@payloadcms/plugin-mcp'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
//   return doc?.title ? `${doc.title} | NexusBerry` : 'NexusBerry Training & Solutions'
// }

// const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
//   const url = getServerSideURL()
//   return doc?.slug ? `${url}/${doc.slug}` : url
// }

/**
 * Get plugins based on environment
 * S3 storage is only included in production (PAYLOAD_LOCAL_STORAGE !== 'true')
 * In local development, Payload uses the staticDir defined in Media collection
 */
export const getPlugins = (): Plugin[] => {
  const basePlugins: Plugin[] = [
    redirectsPlugin({
      collections: ['pages', 'posts', 'departments', 'web-courses'],
      redirectTypes: ['301', '302'],
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
          group: 'All Forms',
        },
        slug: 'forms',
        labels: {
          singular: 'Form Design',
          plural: 'Form Designs',
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
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              'Close Done',
              'Close Rejected',
              'Pending'
            ],
            defaultValue: 'Pending',
            required: true,
            admin: {
              position: 'sidebar',
            },
          },
          {
            name: 'staffNotes',
            label: 'Staff Notes',
            type: 'textarea',
            admin: {
              position: 'sidebar',
            },
          },

        ],
      },
      // ✅ Overrides for the Form Submissions collection
      formSubmissionOverrides: {
        admin: {
          group: 'All Forms',
        },
        slug: 'form-submissions',
        labels: {
          singular: 'Form Submission',
          plural: 'Form Submissions',
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
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
        },
      },
    }),

  ]

  // Only add S3 storage in production (when PAYLOAD_LOCAL_STORAGE is not 'true')
  // In local development, Payload uses the staticDir from Media collection (public/media)
  if (process.env.PAYLOAD_LOCAL_STORAGE !== 'true') {
    basePlugins.push(
      /**
       * UploadThing Storage Adapter Configuration
       *
       * UploadThing is a file hosting service that provides CDN-backed storage.
       * Files are uploaded directly from the browser to UploadThing's servers,
       * bypassing the Next.js server entirely.
       *
       * IMPORTANT: There's a known issue with `clientUploads: true` where the
       * `generateFileURL` function doesn't receive the UploadThing file key.
       * This is fixed via an `afterRead` hook in src/collections/Media.ts
       * that generates the correct URL from the `_key` field.
       *
       * Required Environment Variables:
       * - UPLOADTHING_TOKEN: Auth token from UploadThing dashboard
       * - UPLOADTHING_APP_ID: Your app identifier (e.g., "pn1iqo7y4j")
       *
       * @see src/collections/Media.ts for the URL fix implementation
       * @see https://github.com/payloadcms/payload/issues/11473
       */
      uploadthingStorage({
        // clientUploads: true enables direct browser-to-cloud uploads
        // This is ESSENTIAL for serverless deployments (Vercel, Netlify) because:
        // - Server-side uploads are limited to 4.5MB on Vercel serverless functions
        // - Direct uploads have no size limit and are faster (no server middleman)
        clientUploads: true,

        collections: {
          media: {
            // disablePayloadAccessControl: true bypasses Payload's API proxy
            // Without this, Payload tries to serve files via /api/media/file/...
            // With this enabled, files are served directly from UploadThing's CDN
            // Benefits: faster delivery, reduced server load, CDN caching
            disablePayloadAccessControl: true,

            // NOTE: generateFileURL is intentionally NOT configured here because
            // it doesn't receive the UploadThing file key with clientUploads: true.
            // Instead, the URL is fixed via afterRead hook in Media.ts
          },
        },

        options: {
          // UPLOADTHING_TOKEN: Unified auth token from UploadThing dashboard
          // Found at: https://uploadthing.com/dashboard/{app}/api-keys
          token: process.env.UPLOADTHING_TOKEN,

          // acl: 'public-read' makes uploaded files publicly accessible
          // This is required for images/media that need to be displayed on the website
          acl: 'public-read',
        },
      })

      // s3Storage({ // Old Supabase Storage is same project
      //   collections: {
      //     media: {
      //       prefix: 'media',
      //     }
      //   },
      //   bucket: process.env.S3_BUCKET || '',
      //   config: {
      //     forcePathStyle: true, // Important for using Supabase
      //     credentials: {
      //       accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      //       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      //     },
      //     region: process.env.S3_REGION || '',
      //     endpoint: process.env.S3_ENDPOINT || '',
      //   },
      // }),      
    )
  }

  return basePlugins
}

// Export for backward compatibility
export const plugins: Plugin[] = getPlugins()
