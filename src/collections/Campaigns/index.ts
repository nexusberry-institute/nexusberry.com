import { CollectionConfig } from "payload";
import { anyone } from '@/access/anyone';

const Campaigns: CollectionConfig = {
  slug: "campaigns",
  admin: { useAsTitle: "name" },
  access: {
    create: anyone,
    read: anyone,
    update: anyone,
    delete: anyone,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Campaign Info",
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
              name: "events",
              type: "relationship",
              relationTo: "events",
              hasMany: true,
              required: false,
            },
          ]
        },
        {
          label: "UTM Tracking",
          fields: [
            {
              name: "utm_source",
              type: "text",
              required: false,
              label: "UTM Source",
              admin: {
                description: "Identifies which site sent the traffic (e.g., google, facebook, newsletter)"
              }
            },
            {
              name: "utm_campaign",
              type: "text",
              required: false,
              label: "UTM Campaign",
              admin: {
                description: "Identifies a specific product promotion or strategic campaign (e.g., spring_sale)"
              }
            },
            {
              name: "utm_medium",
              type: "text",
              required: false,
              label: "UTM Medium",
              admin: {
                description: "Identifies what type of link was used (e.g., cpc, banner, email)"
              }
            },
            {
              name: "utm_content",
              type: "text",
              required: false,
              label: "UTM Content",
              admin: {
                description: "Identifies what specifically was clicked to bring the user (e.g., logolink, textlink)"
              }
            },
            {
              name: "utm",
              type: "text",
              required: false,
              label: "Legacy UTM Tracking Code",
              admin: {
                description: "Legacy UTM field - kept for backward compatibility"
              }
            },
          ]
        },
        // {
        //   label: "Campaign Leads",
        //   fields: [
        //     {
        //       name: "campaignLeads",
        //       label: "Leads from This Campaign",
        //       type: "join",
        //       collection: "leads",
        //       on: "eventAttendance.campaign",
        //       access: {
        //         read: ({ req }) => {
        //           // Allow if user is authenticated
        //           return !!req.user
        //         },
        //       },
        //       admin: {
        //         description: "View all leads that came from this campaign. Use this to track campaign effectiveness.",
        //         allowCreate: false,
        //       },
        //       defaultLimit: 10,
        //       defaultSort: '-createdAt',
        //       maxDepth: 1,
        //     }
        //   ]
        // }
      ]
    }
  ],
};

export default Campaigns;
