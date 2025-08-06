// import { checkAccess } from '@/access/accessControl';
import { CollectionConfig } from 'payload';

export const Lectures: CollectionConfig = {
  slug: 'lectures',
  admin: {
    useAsTitle: 'topic',
    group: "Academic Operations",
  },
  access: {
    // create: checkAccess('lectures', 'create'),
    // read: checkAccess('lectures', 'read'),
    // update: checkAccess('lectures', 'update'),
    // delete: checkAccess('lectures', 'delete'),
  },
  fields: [
    {
      name: "topic",
      type: "text",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: 'module',
          type: 'relationship',
          relationTo: 'modules',
          hasMany: false,
        },
        {
          name: 'batches',
          type: 'relationship',
          relationTo: 'batches',
          hasMany: true,
        },
        {
          name: "teacher",
          type: "relationship",
          relationTo: "teachers",
          hasMany: false,
        },
      ]
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: "pattern: Batchslug/moduleSlug/Topicslug",
        description: "pattern: Batchslug/moduleSlug/Topicslug",
      }
    },
    {
      name: "videoUrl",
      type: "textarea",
    },
    {
      name: "notes",
      type: "richText",
    },
    {
      name: "files",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "rating",
      type: "number",
    },
    {
      name: "qa",
      type: "json"
    },
    // {
    //   name: "quiz",
    //   type: "json"
    // }
  ],
};