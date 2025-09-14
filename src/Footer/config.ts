import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media"
    },
    {
      name: "companyDescription",
      type: "text",

    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "text",
        },
        {
          name: "link",
          type: "text"
        }
      ]
    },
    {
      name: "footerCols",
      type: "array",
      maxRows: 3,
      fields: [
        {
          name: "colTitle",
          type: "text",
        },
        {
          name: "rows",
          type: "array",
          fields: [
            {
              name: "rowTitle",
              type: "text",
            },
            {
              name: "href",
              type: "text",
            }
          ]
        }
      ]
    }
  ],
  hooks: {
    // afterChange: [revalidateFooter],
  },
}

