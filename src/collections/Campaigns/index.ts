import { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";

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
  ],
};

export default Campaigns;
