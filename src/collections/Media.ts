import type { CollectionConfig, CollectionAfterReadHook } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Determine if we're using local storage or cloud storage (UploadThing)
const useLocalStorage = process.env.PAYLOAD_LOCAL_STORAGE === 'true'

/**
 * UploadThing URL Fix Hook (afterRead)
 *
 * PROBLEM:
 * When using UploadThing with `clientUploads: true`, files are uploaded directly
 * from the browser to UploadThing's servers. However, the `generateFileURL` function
 * in the storage adapter only receives the original filename, NOT the UploadThing
 * file key (e.g., "8eAtmrMpsgOdCl0jvBvWq1rIh3KXcp4TsZwP0OMQbFEHL8Bi").
 *
 * This causes Payload to store incorrect URLs like:
 *   - "/api/media/file/my-image.png" (local path)
 *   - "https://utfs.io/f/." (malformed URL)
 *
 * Instead of the correct UploadThing CDN URL:
 *   - "https://{appId}.ufs.sh/f/{fileKey}"
 *
 * SOLUTION:
 * The UploadThing adapter DOES store the file key in the `_key` field of the document
 * after upload completes. This hook intercepts every read operation and dynamically
 * generates the correct URL from the `_key` field.
 *
 * WHY afterRead instead of afterChange?
 * - afterChange runs immediately after document creation, but `_key` is often NULL
 *   at that point because the UploadThing callback hasn't completed yet.
 * - afterRead runs whenever the document is fetched, ensuring the URL is always
 *   correct regardless of when `_key` was populated.
 * - This approach doesn't modify the database - it only transforms the response.
 *
 * REQUIREMENTS:
 * - UPLOADTHING_APP_ID must be set in environment variables
 * - The `_key` field must be populated by the UploadThing adapter
 *
 * @see https://github.com/payloadcms/payload/issues/11473
 */
const fixUploadThingURLOnRead: CollectionAfterReadHook = ({ doc }) => {
  // Skip if using local storage (development) or no document
  if (useLocalStorage || !doc) return doc

  // _key is the UploadThing file identifier stored by the adapter after upload
  // Example: "8eAtmrMpsgOdCl0jvBvWq1rIh3KXcp4TsZwP0OMQbFEHL8Bi"
  const fileKey = doc._key
  if (!fileKey) return doc

  // UPLOADTHING_APP_ID is your app identifier from the UploadThing dashboard
  // Example: "pn1iqo7y4j"
  const appId = process.env.UPLOADTHING_APP_ID
  if (!appId) return doc

  // Construct the correct UploadThing CDN URL
  // Format: https://{appId}.ufs.sh/f/{fileKey}
  // Example: https://pn1iqo7y4j.ufs.sh/f/8eAtmrMpsgOdCl0jvBvWq1rIh3KXcp4TsZwP0OMQbFEHL8Bi
  const correctURL = `https://${appId}.ufs.sh/f/${fileKey}`

  // Override the URL in the response (does NOT modify database, only the returned doc)
  if (doc.url !== correctURL) {
    doc.url = correctURL
  }

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: () => true,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterRead: [fixUploadThingURLOnRead],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    // {
    //   name: 'caption',
    //   type: 'richText',
    //   editor: lexicalEditor({
    //     features: ({ rootFeatures }) => {
    //       return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
    //     },
    //   }),
    // },
  ],
  upload: {
    // Upload to the public/media directory in Next.js (local dev only)
    // In production, UploadThing handles storage via the storage adapter
    staticDir: path.resolve(dirname, '../../public/media'),
    // Disable local storage when using UploadThing (cloud storage)
    disableLocalStorage: !useLocalStorage,
    // adminThumbnail: 'og',
    // focalPoint: true,
    // imageSizes: [
    //   {
    //     name: 'thumbnail',
    //     width: 300,
    //   },
    //   {
    //     name: 'square',
    //     width: 500,
    //     height: 500,
    //   },
    //   {
    //     name: 'small',
    //     width: 600,
    //   },
    //   {
    //     name: 'medium',
    //     width: 900,
    //   },
    //   {
    //     name: 'large',
    //     width: 1400,
    //   },
    //   {
    //     name: 'xlarge',
    //     width: 1920,
    //   },
    //   {
    //     name: 'og',
    //     width: 1200,
    //     height: 630,
    //     crop: 'center',
    //   },
    // ],
  },
}
