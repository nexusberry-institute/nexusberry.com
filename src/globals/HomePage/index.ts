import { revalidateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      ({ req: { payload, context } }) => {
        if (context.disableRevalidate) return
        payload.logger.info("Revalidating Home Page")
        revalidateTag("global_home-page")
      },
    ],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        {
          name: "featuredImages",
          type: "array",
          maxRows: 3,
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "alt",
              type: "text",
            },
            {
              name: "link",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "logoCarousel",
          type: "array",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "link",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "departmentsSection",
      type: "group",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Explore Leading Career Domains",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "buttonLabel",
          type: "text",
          defaultValue: "Browse All Courses",
        },
        {
          name: "buttonLink",
          type: "text",
          defaultValue: "/departments",
        },
      ],
    },
    {
      name: "coursesSection",
      type: "group",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
    {
      name: "eventsSection",
      type: "group",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "badgeText",
          type: "text",
          defaultValue: "Upcoming Events",
        },
        {
          name: "heading",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "ctaHeading",
          type: "text",
        },
        {
          name: "ctaDescription",
          type: "textarea",
        },
        {
          name: "buttonText",
          type: "text",
          defaultValue: "Explore All Events",
        },
        {
          name: "buttonLink",
          type: "text",
          defaultValue: "/events",
        },
      ],
    },
    {
      name: "locationSection",
      type: "group",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
  ],
}
