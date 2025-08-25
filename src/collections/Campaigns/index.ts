import { CollectionConfig } from "payload";

const Campaigns: CollectionConfig = {
  slug: "campaigns",
  admin: { useAsTitle: "name" },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "platform",
      type: "text",
      required: false,
    },
    {
      name: "startDate",
      type: "date",
      required: false,
    },
    {
      name: "endDate",
      type: "date",
      required: false,
    },
    {
      name: "budget",
      type: "number",
      required: false,
      min: 0,
    },
    {
      name: "utm",
      type: "text",
      required: false,
      label: "UTM Tracking Code",
    },
    {
      name: "events",
      type: "relationship",
      relationTo: "events",
      hasMany: true,
      required: false,
    },
    {
      name: "visitorCount",
      type: "number",
      required: false,
      defaultValue: 0,
      min: 0,
      label: "Visitor Count (UTM Tracked)",
    },
  ],
};

export default Campaigns;
