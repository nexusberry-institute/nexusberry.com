import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    description: 'Manage the videos',
    group: "Classwork",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video Title',
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      label: 'Video URL OR File Path',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail Image',
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Notes',
    },
    {
      name: 'assignment',
      type: 'richText',
      label: 'Assignment',
    },
    {
      name: 'qa',
      type: 'array',
      label: 'Q/A',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Answer',
        },
        {
          name: 'timestamp',
          type: 'text',
          label: 'Timestamp (HH:MM:SS)',
        },
      ],
    },
    slugField(),
  ],
}
