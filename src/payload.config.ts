import { buildConfig } from 'payload'
// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { fileURLToPath } from 'url'
// import { NexusBerryLogo } from '../public/placeHolders/NexusBerry_favi.jpg'

import collections from '@/collections'
import globals from './globals'

import { Users } from '@/collections/Users'
import { plugins } from './plugins'
// import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
// import { googleCallbackEndPoint } from './endpoints/auth'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // avatar:{
    //   collection: Users.slug,
    //   // image: Users.user-photo.url,
    //   size: 'md',
    // },
    theme: 'dark',
    meta: {
      description: 'This is a custom Hello description',
      icons: [
        {
          type: 'image/jpg',
          rel: 'icon',
          url: '/icons/favi.jpg',
        },
      ],
      openGraph: {
        description: 'This is a custom OG description',
        images: [
          {
            height: 600,
            url: '/website-template-OG.webp',
            width: 800,
          },
        ],
        title: 'This is a custom OG title',
      },
      titleSuffix: '- Nexusberry',
    },
    components: {
      graphics: {
        Icon: '@/graphics/Icon/index.tsx#Icon',
        Logo: '@/graphics/Logo/index.tsx#Logo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },

    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // endpoints: [googleCallbackEndPoint],
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // max: 8, // Use 10 out of your 15 available connections in supabase nano tier
      // min: 2, // Keep 2 connections always ready
      // idleTimeoutMillis: 30000,
      // connectionTimeoutMillis: 2000,
    },
  }),
  collections,
  cors: [getServerSideURL()].filter(Boolean),
  csrf: [getServerSideURL()].filter(Boolean),
  globals,
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!, // Use the same email as in auth.user
    defaultFromName: process.env.DEFAULT_EMAIL_NAME!,
    transportOptions: {
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: true, // true for 465, false for other
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      // Additional options for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    },
  }),

  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
      where: {
        roles: {
          contains: 'superadmin',
        }
      }
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          username: 'superadmin',
          email: 'admin@nexusberry.com',
          password: '12345678',
          roles: ["superadmin"]
        },
      })
    }
  },
})
