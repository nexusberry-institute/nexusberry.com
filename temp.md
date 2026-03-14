i want to simplify the architecture for the attendance module.
1. in each @src/collections/Attendences\ there will be exaclty one batch. 
2. in @src/collections/Attendences\ the Teacher field should be removed. It seems redundent and voilating data integretigy and no single source of truth and bad ux. Every batch is assigend one or more teachers and when we assign a batch to a attendance we can get teachers for that batch via this relation. we can also get teachers list in frontend via attenace -> batche -> teachers
3. It will also rrduce api find calls at @src\app\(frontend)\(dashboard)\teacher\attendance\[attendanceId]\page.tsx 
4. i want to add some analytics and filters above table in @src\app\(frontend)\(dashboard)\teacher\attendance\[attendanceId]\page.tsx . Show counters: all, present, absent, leave, and online, physical. these counters should aslo also act as filters.  The last column in the list or table i.e. Medium should be editable showing possible values in dropdown but initialzed from api.
Plan the changes in frontend and payloadcms collections. reseach carefully for updates required at all place. also preserving data already added, just one session attendance is saved so far. Run all steps in claude.md


---
Users Collection:
- remove student field
- connect with student
- if user is blocked show blocked page with info (in user may create a block reason test field)

AdmissionRequests:
1. approve only by super admin
2. make installments

FeeReceipts
- show list of isntallments
- studetns dashboard shows submit fee
- only superadmin can verify



---
Tutorials:
dashboard: fetch batch assigned tutorial

tutorials subject list on sidebar, 
featured subjects in main area
only 4 tutorials in main with order: features or last four desc

---
 remove easy to fix erros like variable defined but never used, unused imports, react/no-unescaped-entities, etc.
 ---
batch slug
---
add a new field to add student student picture and diplay in dashboard