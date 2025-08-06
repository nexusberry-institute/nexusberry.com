// import { checkAccess } from "@/access/accessControl";
import { CollectionConfig } from "payload";

export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "title",
    group: "Marketing & Outreach"
  },
  access: {
    // create: checkAccess('messages', 'create'),
    // read: checkAccess('messages', 'read'),
    // update: checkAccess('messages', 'update'),
    // delete: checkAccess('messages', 'delete'),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true
    },
    {
      name: "content",
      type: "textarea",
      required: true
    },
    {
      name: "type",
      type: "select",
      options: [
        {
          label: "General",
          value: "GENERAL"
        },
        {
          label: "Whatsapp",
          value: "WHATSAPP"
        }
      ]
    },
    {
      name: "hasPlaceholder",
      type: "checkbox",
    },
    {
      name: "staffNote",
      type: "textarea",
    }
  ]
}