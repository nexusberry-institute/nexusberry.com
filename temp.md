admission form (https://www.nexusberry.com/forms/admission) submission is giving error:

2026-02-27 09:54:24.484 [error] Admission request error: Error: Failed query: select "admission_requests"."id", "admission_requests"."status", "admission_requests"."assigned_batch_id", "admission_requests"."enrollment_mode", "admission_requests"."lead_id", "admission_requests"."staff_notes", "admission_requests"."rejection_reason", "admission_requests"."full_name", "admission_requests"."email", "admission_requests"."phone_number", "admission_requests"."father_name", "admission_requests"."guardian_phone", "admission_requests"."cnic", "admission_requests"."gender", "admission_requests"."education", "admission_requests"."date_of_birth", "admission_requests"."address_home_address", "admission_requests"."address_city", "admission_requests"."address_province", "admission_requests"."address_country", "admission_requests"."department_id", "admission_requests"."course_id", "admission_requests"."preferred_medium", "admission_requests"."total_fee_package", "admission_requests"."remaining_installments", "admission_requests"."first_payment_amount", "admission_requests"."pay_date", "admission_requests"."paid_method", "admission_requests"."payment_proof_image_id", "admission_requests"."payment_proof_text", "admission_requests"."student_note", "admission_requests"."total_fee", "admission_requests"."submitted_by_id", "admission_requests"."created_student_id", "admission_requests"."created_enrollment_id", "admission_requests"."processing_error", "admission_requests"."processed_at", "admission_requests"."temp_password", "admission_requests"."updated_at", "admission_requests"."created_at", "admission_requests_installments"."data" as "installments" from "admission_requests" "admission_requests" left join lateral (select coalesce(json_agg(json_build_array("admission_requests_installments"."_order", "admission_requests_installments"."id", "admission_requests_installments"."amount", "admission_requests_installments"."due_date", "admission_requests_installments"."status", "admission_requests_installments"."paid_method", "admission_requests_installments"."note") order by "admission_requests_installments"."_order" asc), '[]'::json) as "data" from (select * from "admission_requests_installments" "admission_requests_installments" where "admission_requests_installments"."_parent_id" = "admission_requests"."id" order by "admission_requests_installments"."_order" asc) "admission_requests_installments") "admission_requests_installments" on true where ("admission_requests"."email" = $1 and "admission_requests"."course_id" = $2 and "admission_requests"."created_at" > $3 and "admission_requests"."status" not in ($4)) order by "admission_requests"."created_at" desc limit $5
params: nexusberry.it@gmail.com,3,2026-01-28T09:54:24.068Z,rejected,1
    at iT.queryWithCache (.next/server/chunks/3902.js:69:20009)
    at async (.next/server/chunks/3902.js:69:23097)
    at async dY (.next/server/chunks/3902.js:37:1334)
    at async x (.next/server/chunks/3902.js:744:215576)
    at async y (.next/server/app/api/admission-request/route.js:1:4376)
    at async k (.next/server/app/api/admission-request/route.js:1:8599) {
  query: `select "admission_requests"."id", "admission_requests"."status", "admission_requests"."assigned_batch_id", "admission_requests"."enrollment_mode", "admission_requests"."lead_id", "admission_requests"."staff_notes", "admission_requests"."rejection_reason", "admission_requests"."full_name", "admission_requests"."email", "admission_requests"."phone_number", "admission_requests"."father_name", "admission_requests"."guardian_phone", "admission_requests"."cnic", "admission_requests"."gender", "admission_requests"."education", "admission_requests"."date_of_birth", "admission_requests"."address_home_address", "admission_requests"."address_city", "admission_requests"."address_province", "admission_requests"."address_country", "admission_requests"."department_id", "admission_requests"."course_id", "admission_requests"."preferred_medium", "admission_requests"."total_fee_package", "admission_requests"."remaining_installments", "admission_requests"."first_payment_amount", "admission_requests"."pay_date", "admission_requests"."paid_method", "admission_requests"."payment_proof_image_id", "admission_requests"."payment_proof_text", "admission_requests"."student_note", "admission_requests"."total_fee", "admission_requests"."submitted_by_id", "admission_requests"."created_student_id", "admission_requests"."created_enrollment_id", "admission_requests"."processing_error", "admission_requests"."processed_at", "admission_requests"."temp_password", "admission_requests"."updated_at", "admission_requests"."created_at", "admission_requests_installments"."data" as "installments" from "admission_requests" "admission_requests" left join lateral (select coalesce(json_agg(json_build_array("admission_requests_installments"."_order", "admission_requests_installments"."id", "admission_requests_installments"."amount", "admission_requests_installments"."due_date", "admission_requests_installments"."status", "admission_requests_installments"."paid_method", "admission_requests_installments"."note") order by "admission_requests_installments"."_order" asc), '[]'::json) as "data" from (select * from "admission_requests_installments" "admission_requests_installments" where "admission_requests_installments"."_parent_id" = "admission_requests"."id" order by "admission_requests_installments"."_order" asc) "admission_requests_installments") "admission_requests_installments" on true where ("admission_requests"."email" = $1 and "admission_requests"."course_id" = $2 and "admission_requests"."created_at" > $3 and "admission_requests"."status" not in ($4)) order by "admission_requests"."created_at" desc limit $5`,
  params: [Array],
  [cause]: error: column admission_requests.father_name does not exist
      at <unknown> (.next/server/chunks/3902.js:174:60264)
      at async (.next/server/chunks/3902.js:69:23306)
      at async iT.queryWithCache (.next/server/chunks/3902.js:69:19984)
      at async (.next/server/chunks/3902.js:69:23097)
      at async dY (.next/server/chunks/3902.js:37:1334)
      at async x (.next/server/chunks/3902.js:744:215576)
      at async y (.next/server/app/api/admission-request/route.js:1:4376) {
    length: 129,
    severity: 'ERROR',
    code: '42703',
    detail: undefined,
    hint: undefined,
    position: '358',
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'parse_relation.c',
    line: '3716',
    routine: 'errorMissingColumn'
  }
}

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
3. make name field required
---

students status vs enrollments status

---
Fee Recipts sort by Status Paid

columns order in admin ui
---

tutorails flow
tutorials subject list on sidebar, 
featured subjects in main area
only 4 tutorials in main with order: features or last four desc

fetch only free
dashboard: fetch batch assigned tutorial
---
 remove easy to fix erros like variable defined but never used, unused imports etc.
 ---