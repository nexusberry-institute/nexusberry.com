# Admin Collections:
arrange the attendance, attendanceDetails, time table collections in the admin with sidebase with sidebar for better ux. changes in collections:
1. Attendance collection: onlineClassLink in optional field as these may a on-campus only class or a backdated attedance marking, expiry field default time is 90 minutes from now, drop field classType, drop field medium, drop field content, add a text field for staff notes, for the filterOptions in batches field show all active batches and do not firlter based ob time table to make it simple, 
2. AttendanceDetail collection: create custom Field component for attendance status, field attendance is not required, default medium is online, default status is absent
3. TimeTable collection: romove field room

# Frontend Teacher Dashboard:
- in leftside bar show attendaces marks for his batches with an option to edit.
- in the frontend give an option to teacher to create new attendacne manually, he should slectect his one or more batches from dropdown and below it load all students enrtolled in that batch to mark and save attendance manually.

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