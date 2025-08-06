import { CollectionConfig } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  SuperscriptFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical';

export const Instructors: CollectionConfig = {
  slug: "instructors",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "expertise",
      type: "text",
      required: true,
    },
    {
      name: "experience",
      type: "number",
      required: true,
    },
    {
      name: "biography",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            SuperscriptFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
          ]
        },
      }),
      required: true,
    }
  ]
}