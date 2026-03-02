import type { CollectionConfig } from "payload";
import { slugField } from '@/fields/slug'
import { revalidateTutorial, revalidateDeleteTutorial } from './hooks/revalidateTutorial'
import { richTextField } from '@/fields/richTextField'
import { checkRole } from '@/access/checkRole'

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: {
    useAsTitle: 'title',
    description: 'Tutorials of All Subjects',
    group: "Classwork",
  },
  access: {
    create: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
    read: ({ req: { user } }) => {
      if (user && checkRole(['superadmin', 'admin'], user)) return true
      return { isPublic: { equals: true } }
    },
    update: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
    delete: ({ req: { user } }) => checkRole(['superadmin', 'admin'], user),
  },
  hooks: {
    afterChange: [revalidateTutorial],
    afterDelete: [revalidateDeleteTutorial],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    ...slugField(),
    {
      name: 'position',
      type: "number",
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subject',
      type: "relationship",
      relationTo: 'tutorial-subjects',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'label',
      type: "text",
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      label: 'Public',
      admin: {
        position: 'sidebar',
        description: 'When enabled, this tutorial is visible on the public website. Tutorials not marked as public are only accessible via the admin panel.',
      },
    },
    {
      name: 'requiresLogin',
      type: 'checkbox',
      defaultValue: false,
      label: 'Requires Login',
      admin: {
        position: 'sidebar',
        description: 'When enabled, users must log in to access videos and tab content. The description is always visible to everyone.',
        condition: (data) => data?.isPublic === true,
      },
    },
    {
      name: 'showVideos',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Videos',
      admin: {
        position: 'sidebar',
        description: 'When enabled, videos will be displayed on the frontend.',
      },
    },
    {
      name: 'showQuiz',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Quiz',
      admin: {
        position: 'sidebar',
        description: 'When enabled, the quiz tab will be displayed on the frontend.',
      },
    },
    {
      name: 'showAssignment',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Assignment',
      admin: {
        position: 'sidebar',
        description: 'When enabled, the assignment tab will be displayed on the frontend.',
      },
    },
    {
      name: 'showCode',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Code',
      admin: {
        position: 'sidebar',
        description: 'When enabled, the code tab will be displayed on the frontend.',
      },
    },
    {
      name: 'showPresentation',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Presentation',
      admin: {
        position: 'sidebar',
        description: 'When enabled, the presentation tab will be displayed on the frontend.',
      },
    },
    {
      name: 'batches',
      type: 'relationship',
      relationTo: 'batches',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Batches associated with this tutorial.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Description',
          fields: [
            richTextField({ name: 'description', label: 'Description' }),
          ],
        },
        {
          label: 'Cheatsheet',
          fields: [
            richTextField({ name: 'content', label: 'Tutorial Content' }),
          ],
        },
        {
          label: 'Video',
          fields: [
            {
              name: 'videos',
              type: 'array',
              label: 'Videos',
              fields: [
                {
                  name: 'videoSource',
                  type: 'select',
                  label: 'Video Source',
                  defaultValue: 'youtube',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Bunny CDN', value: 'bunny' },
                  ],
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  label: 'YouTube Video URL',
                  admin: {
                    placeholder: 'https://www.youtube.com/watch?v=...',
                    condition: (_, siblingData) => siblingData?.videoSource === 'youtube',
                  },
                },
                {
                  name: 'bunnyVideoId',
                  type: 'text',
                  label: 'Bunny CDN Video ID',
                  admin: {
                    placeholder: 'e.g. abc123-def456',
                    description: 'The video ID from your Bunny CDN library',
                    condition: (_, siblingData) => siblingData?.videoSource === 'bunny',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Quiz',
          fields: [
            {
              name: 'quiz',
              type: 'relationship',
              relationTo: 'quizzes',
              label: 'Quiz',
            },
          ],
        },
        {
          label: 'Assignment',
          fields: [
            richTextField({ name: 'assignment', label: 'Assignment Content' }),
          ],
        },
        {
          label: 'Resources',
          fields: [
            {
              name: 'codeUrl',
              type: 'text',
              label: 'Code URL',
              admin: {
                placeholder: 'https://codesandbox.io/... or https://github.com/...',
                description: 'Link to CodeSandbox, StackBlitz, CodePen, or GitHub repository',
              },
            },
            {
              name: 'presentationUrl',
              type: 'text',
              label: 'Presentation URL',
              admin: {
                placeholder: 'https://docs.google.com/presentation/d/.../edit',
                description: 'Link to Google Slides or other presentation',
              },
            },
          ],
        },
      ],
    },
  ]
}
