import { AlignFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, UnorderedListFeature } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const SOPs: CollectionConfig = {
  slug: "sops",
  labels: {
    plural: "SOP's"
  },
  admin: {
    listSearchableFields: ["title", "tags"]
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true
    },
    {
      name: "tags",
      type: "text",
      hasMany: true
    },
    {
      name: "description",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            UnorderedListFeature(),
            HorizontalRuleFeature(),
            AlignFeature(),
          ]
        },
      })
    },
  ]
}