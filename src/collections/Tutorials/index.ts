import type { CollectionConfig } from "payload";
import { slugField } from '@/fields/slug'
import { revalidateTutorial, revalidateDeleteTutorial } from './hooks/revalidateTutorial'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Code } from '../../blocks/Code/config'

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: {
    useAsTitle: 'title',
    description: 'Tutorials of All Subjects',
    group: "Classwork",
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
      type: 'tabs',
      tabs: [
        {
          label: 'Video',
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
        {
          label: 'Cheatsheet',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Tutorial Content',
              editor: lexicalEditor({
                features: ({ defaultFeatures, rootFeatures }) => [
                  ...defaultFeatures,
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Code] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
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
            {
              name: 'assignment',
              type: 'richText',
              label: 'Assignment Content',
            },
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
