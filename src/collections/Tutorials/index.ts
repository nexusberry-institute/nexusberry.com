import type { CollectionConfig } from "payload";
import { slugField } from '@/fields/slug'

export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  admin: {
    useAsTitle: 'title',
    description: 'Tutorials of All Subjects',
    group: "Classwork",
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
    {
      name: 'content',
      type: 'richText',
      label: 'Tutorial Content',
    },
  ]
}