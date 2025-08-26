import { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";

const Campaigns: CollectionConfig = {
  slug: "campaigns",
  admin: { useAsTitle: "name" },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (doc && doc.events && Array.isArray(doc.events)) {
          try {
            // Calculate combined statistics from all events in this campaign
            let totalRegistrations = 0;
            let totalCampaignConversions = 0;

            for (const eventId of doc.events) {
              try {
                const event = await req.payload.findByID({
                  collection: 'events',
                  id: typeof eventId === 'object' ? eventId.id : eventId,
                });

                if (event) {
                  totalRegistrations += event.actualRegistrations || 0;
                  totalCampaignConversions += event.campaignVisitors || 0;
                }
              } catch (e) {
                console.warn(`Failed to fetch event ${eventId}:`, e);
              }
            }

            // Update the document with calculated values (non-persistent, just for display)
            doc.combinedRegistrations = totalRegistrations;
            doc.combinedCampaignConversions = totalCampaignConversions;
          } catch (error) {
            console.warn('Failed to calculate campaign statistics:', error);
            // Set default values if calculation fails
            doc.combinedRegistrations = 0;
            doc.combinedCampaignConversions = 0;
          }
        }
        return doc;
      }
    ]
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
            {
              name: "combinedRegistrations",
              type: "number",
              required: false,
              defaultValue: 0,
              min: 0,
              label: "Total Event Registrations",
              admin: {
                readOnly: true,
                description: "Combined registrations from all events in this campaign (auto-calculated)"
              }
            },
            {
              name: "combinedCampaignConversions",
              type: "number",
              required: false,
              defaultValue: 0,
              min: 0,
              label: "Total Campaign Conversions",
              admin: {
                readOnly: true,
                description: "Combined conversions (registrations via UTM) from all events (auto-calculated)"
              }
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
        {
          label: "Campaign Leads",
          fields: [
            {
              name: "campaignLeads",
              label: "Leads from This Campaign",
              type: "join",
              collection: "leads",
              on: "campaigns",
              admin: {
                description: "View all leads that came from this campaign. Use this to track campaign effectiveness.",
                allowCreate: false,
              },
              defaultLimit: 10,
              defaultSort: '-createdAt',
              maxDepth: 1,
            }
          ]
        }
      ]
    }
  ],
};

export default Campaigns;
