# Website: NexusBerry Training & Solutions (https://www.nexusberry.com/)

NexusBerry Training & Solutions is a full-stack education management platform built with Next.js 15 (App Router), PayloadCMS 3.68.3, and PostgreSQL. It combines a headless CMS with student/course management, LMS, event management, and marketing automation.

**Tech Stack:**
- Next.js 15.4.11 with React 19 (App Router)
- PayloadCMS 3.76.1 (Headless CMS)
- PostgreSQL via Supabase (@payloadcms/db-postgres)
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- pnpm 10.13.1


---
changes required in students collection:
1. update filteroptions to further improve ux, filter users who has role student and users who do have relation with any student already:
{
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              hasMany: false,
              unique: true,
              filterOptions: {
                roles: { contains: 'student' },
              },
            }

2. in admin panel, i want to see all feeReceipts of a student for all enrollments in a tab next to enrollments tab. note that student has relation with feeReceipts via enrollments
---
