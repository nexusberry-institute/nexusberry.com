// import { checkAccess } from "@/access/accessControl";
import { slugField } from "@/fields/slug";
import { CollectionConfig } from "payload";

export const Modules: CollectionConfig = {
  slug: "modules",
  admin: {
    useAsTitle: "title",
    group: "Classwork"
  },
  access: {
    // create: checkAccess('modules', 'create'),
    // read: checkAccess('modules', 'read'),
    // update: checkAccess('modules', 'update'),
    // delete: checkAccess('modules', 'delete'),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField("title", {
      slugOverrides: {
        admin: {
          placeholder: "Will be created automatically from title",
        }
      }
    }),
    {
      name: "nick",
      type: "text",
      required: true,
    },
    {
      name: "lectures",
      type: "relationship",
      relationTo: "lectures",
      hasMany: true,
    },
    {
      name: "description",
      type: "text",
      required: false,
    },
  ],
};