import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/checkRole'

export const TutorialVideoWatchLogs: CollectionConfig = {
  slug: 'tutorial-video-watch-logs',
  admin: {
    group: 'Classwork',
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'tutorial',
      type: 'relationship',
      relationTo: 'tutorials',
      required: true,
      index: true,
    },
    {
      name: 'videoIndex',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Index of the video in the tutorial videos array (0-based)',
      },
    },
    {
      name: 'totalWatchTime',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Total seconds watched (accumulated across all sessions)',
        readOnly: true,
      },
    },
    {
      name: 'lastWatchedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sessions',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: {
        description: 'Total number of watch sessions',
        readOnly: true,
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin', 'superadmin'], user)) return true
      return { user: { equals: user.id } }
    },
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['admin', 'superadmin'], user)
    },
  },
}
