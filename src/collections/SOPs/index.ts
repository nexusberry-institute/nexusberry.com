import { CollectionConfig } from "payload";
import { richTextField } from "@/fields/richTextField";

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
    richTextField({ name: 'description', required: true }),
  ]
}