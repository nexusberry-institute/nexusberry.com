
---
Fix this breaking route /teacher/dashboard. the vercel log is:
f: The following path cannot be queried: teacher
    at l (.next/server/chunks/7115.js:306:29182)
    at async x (.next/server/chunks/7115.js:766:171797)
    at async q (.next/server/app/(frontend)/(dashboard)/teacher/dashboard/page.js:1:2107) {
  data: [Array],
  isOperational: true,
  isPublic: true,
  status: 400,
  digest: '4145184775',
  [cause]: [Array]
}


---
Users Collection:
- remove student field and use connect virtual field with student instead
- if user is blocked show blocked page with instructions that his account is temporarily blocked and contact nexusberry staff for help
- only superadmin can create to assign admin or superadmin role to a user

---

AdmissionRequests:
1. approve only by super admin
2. make installments

---

FeeReceipts
- admin: separate upload c ollection for fee receipts
- admin: only superadmin can verify
- dashboard: show list of isntallments
- dashboard: studetns dashboard shows submit fee


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
---
login page:
do not auto save last login  
login -> brower back -> login (not recommended)

---
Media
- delete all pictures from frontend
- organize in folders

---