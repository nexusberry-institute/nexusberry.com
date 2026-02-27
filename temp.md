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
tutorails flow
tutorials subject list on sidebar, 
featured subjects in main area
only 4 tutorials in main with order: features or last four desc

fetch only free
dashboard: fetch batch assigned tutorial
---
 remove easy to fix erros like variable defined but never used, unused imports etc.