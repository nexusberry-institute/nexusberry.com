import { revalidateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const GlobalEventData: GlobalConfig = {
  slug: "global-event-data",
  label: "Global Event Data",
  access: {
    read: () => true, // Public access
  },
  hooks: {
    afterChange: [
      ({ req: { payload } }) => {
        payload.logger.info("Revalidating Global Event Data");
        revalidateTag("global-event-data");
      }
    ]
  },
  fields: [
    {
      name: "whatsappCommunity",
      label: "WhatsApp Community Link",
      type: "text",
      required: true,
    },
    {
      name: "whatsappQR",
      label: "WhatsApp QR Code",
      type: "upload",
      relationTo: "media",
      // required: true,
    },
    {
      name: "totalAttendees",
      label: "Total Attendees Till Date",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "completedByLearners",
      label: "Completed By Learners",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },

    // ✅ New Fields for Homepage Event CTA
    // {
    //   name: "showEventCTA",
    //   label: "Show Homepage Event Section",
    //   type: "checkbox",
    //   defaultValue: true,
    // },
    // {
    //   name: "ctaBadgeText",
    //   label: "Badge Text",
    //   type: "text",
    //   defaultValue: "Upcoming Events",
    // },
    // {
    //   name: "ctaTitle",
    //   label: "CTA Heading",
    //   type: "text",
    //   defaultValue: "Discover Amazing Events",
    // },
    // {
    //   name: "ctaDescription",
    //   label: "CTA Description",
    //   type: "textarea",
    //   defaultValue:
    //     "Join thousands of professionals at our curated events designed to inspire, educate, and connect.",
    // },
    // {
    //   name: "ctaButtonText",
    //   label: "Button Text",
    //   type: "text",
    //   defaultValue: "Explore All Events",
    // },
    // {
    //   name: "ctaButtonLink",
    //   label: "Button Link",
    //   type: "text",
    //   defaultValue: "/events",
    // },

  ],
};
