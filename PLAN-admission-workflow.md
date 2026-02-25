# Student Admission Workflow - Implementation Plan

## Context

Currently, admitting a student requires staff to manually create 4 separate records (User, Student, Enrollment, FeeReceipt) across different CMS collections. This is slow, error-prone, and disconnected from the student's own data entry. The goal is to let the student self-submit their details + payment proof via a form, and let staff approve with minimal clicks - auto-creating all required records.

## Solution Overview

1. **New `AdmissionRequests` collection** - captures student-submitted data + staff review workflow
2. **Approval hook** - when staff sets status to "approved", auto-creates User + Student + Enrollment + FeeReceipts
3. **Enhanced `FeeReceipts`** - add `enrollment` link so receipts are tied to specific enrollments
4. **New frontend admission form** - replaces the bare-bones existing form with a multi-step form
5. **New API endpoint** - handles anonymous form submission with validation and duplicate detection

## Workflow

```
Student pays offline (WhatsApp with CSR)
  -> Student visits /forms/admission, must login via Google first
  -> Google login auto-creates User account (verified, no OTP needed)
  -> Student fills form (email pre-filled, personal info + payment screenshot)
  -> Creates AdmissionRequest linked to their User (status: pending)
  -> Staff reviews in /admin, assigns batch, fills installment plan
  -> Staff sets status = "approved"
  -> Hook auto-creates: Student -> Enrollment -> FeeReceipts (User already exists)
  -> AdmissionRequest moves to "processed" with links to all created records
  -> Student can now login via Google and access LMS
```

**Edge case:** If staff creates an AdmissionRequest directly in admin (without form), the hook creates a User with a temp password shown in the Processing Results tab. Staff shares it via WhatsApp.

---

## 1. New Collection: `AdmissionRequests`

**File:** `src/collections/AdmissionRequests/index.ts`

**Admin:** group "Academic Operations", useAsTitle "fullName"

### Sidebar Fields
| Field | Type | Notes |
|-------|------|-------|
| `status` | select | pending / reviewing / approved / rejected / processed |
| `assignedBatch` | relationship -> batches | Staff assigns before approval, filtered to active |
| `enrollmentMode` | select | ONLINE / PHYSICAL / HYBRID |
| `lead` | relationship -> leads | Optional link to existing Lead |
| `staffNotes` | textarea | Internal staff notes |
| `rejectionReason` | textarea | Shown only when status=rejected |

### Tab 1: Personal Info (student-submitted)
| Field | Type | Notes |
|-------|------|-------|
| `fullName` | text | Required, min 3 chars |
| `email` | email | Required, indexed |
| `phoneNumber` | text | Required |
| `guardianPhone` | text | Optional |
| `cnic` | text | Optional |
| `gender` | select | male / female |
| `education` | text | Highest education |
| `dateOfBirth` | date | dayOnly picker |
| `address` | group | homeAddress, city, province, country |

### Tab 2: Course & Payment (student-submitted)
| Field | Type | Notes |
|-------|------|-------|
| `course` | relationship -> web-courses | Required |
| `preferredMedium` | select | ONLINE / PHYSICAL / HYBRID |
| `firstPaymentAmount` | number | Amount of first installment paid |
| `paidMethod` | select | BANK / CASH / JAZZCASH / EASYPAISA |
| `paymentProofImage` | upload -> media | Screenshot of payment |
| `paymentProofText` | text | Transaction ID / reference |
| `studentNote` | textarea | Any message from student |

### Tab 3: Installment Plan (staff fills before approval)
| Field | Type | Notes |
|-------|------|-------|
| `totalFee` | number | Total agreed fee |
| `installments` | array | Each: amount, dueDate, status (RECEIVED/PENDING/DEAD), paidMethod, note |

### Tab 4: Processing Results (auto-populated by hook, read-only)
| Field | Type | Notes |
|-------|------|-------|
| `submittedBy` | relationship -> users | The Google-authenticated user who submitted the form |
| `createdStudent` | relationship -> students | Auto-linked after approval |
| `createdEnrollment` | relationship -> enrollments | Auto-linked after approval |
| `processingError` | textarea | Error details if approval failed |
| `processedAt` | date | When processing completed |
| `tempPassword` | text | Only set if hook had to create a new user (staff-created request). Staff shares via WhatsApp. |

### Access Control
- `create`: `() => true` (public form submission)
- `read/update/delete`: superadmin, admin, operations, csr

### Hook
- `afterChange`: `processAdmissionApproval` - fires when status transitions to "approved"

---

## 2. Approval Hook: `processAdmissionApproval`

**File:** `src/collections/AdmissionRequests/hooks/processAdmissionApproval.ts`

**Trigger:** `afterChange` when status changes to "approved" (not from "approved" or "processed")

**Validation before processing:**
- Batch must be assigned (reverts to "reviewing" with error if not)
- Installments array must have at least 1 entry

**Steps:**
1. **Find or create User** - check `submittedBy` (Google login user). If missing (staff-created request), search by email; if not found, create with temp password + `_verified: true` and store temp password in `tempPassword` field. Add "student" role if not present.
2. **Find or create Student** - search by user ID; if exists, reuse; if not, create with personal info from request
3. **Create Enrollment** - link student + assigned batch; catch duplicate enrollment error gracefully
4. **Create FeeReceipts** - one per installment; first marked RECEIVED + verified with proof image; rest marked PENDING
5. **Update Lead** - if linked, set stage to "ENROLLED"
6. **Update AdmissionRequest** - set status to "processed", populate createdStudent/createdEnrollment/processedAt

**Error handling:** If any step fails, `processingError` field is populated with details. Staff can fix and retry by setting status back to "approved".

---

## 3. Changes to Existing Collections

### FeeReceipts (`src/collections/FeeReceipts/index.ts`)

Add 3 new fields:
- `enrollment` (relationship -> enrollments) - links receipt to specific enrollment
- `installmentNumber` (number) - which installment (1, 2, 3...)
- `admissionRequest` (relationship -> admission-requests, readOnly) - source reference

### Enrollments (`src/collections/Enrollments/index.ts`)

Add 1 virtual join field (no migration needed):
- `feeReceipts` (join on fee-receipts.enrollment) - shows linked receipts in admin

---

## 4. API Endpoint

**File:** `src/app/api/admission-request/route.ts`

POST handler that:
- **Requires authentication** (reads user from `payload-token` cookie - Google login enforced by frontend)
- Validates required fields (fullName, email, phoneNumber, course)
- Checks for duplicate submission (same email + course within 30 days, excluding rejected)
- Auto-links to existing Lead by matching email or phone
- Sets `submittedBy` to the authenticated user's ID
- Creates AdmissionRequest with `overrideAccess: true`
- Returns success message or appropriate error

---

## 5. Frontend Admission Form

**Replace:** `src/app/(frontend)/(website)/forms/admission/page.tsx`

**Requires Google login first.** If not logged in, show a Google login button with a message explaining why. After login, the form appears with email pre-filled and read-only.

Multi-step form with 4 steps:

| Step | Title | Fields |
|------|-------|--------|
| 1 | Personal Details | fullName, email (pre-filled, read-only), phoneNumber, guardianPhone, cnic, gender, education, dateOfBirth |
| 2 | Address | homeAddress, city, province, country |
| 3 | Course Selection | course (dropdown from API), preferredMedium |
| 4 | Payment Details | firstPaymentAmount, paidMethod, paymentProofImage (upload), paymentProofText, studentNote |

**After submit:** Success dialog with confirmation message.

**Validation:** Zod schema for all fields.

**File upload:** POST to `/api/media` (create: () => true) to get media ID, then include in admission request. User is authenticated via Google so upload works cleanly.

### New Files
```
src/app/(frontend)/(website)/forms/admission/
  page.tsx                  -- Server wrapper
  AdmissionForm.tsx         -- Client component (multi-step)
  schema.ts                 -- Zod validation
  actions.ts                -- Server action to fetch courses
```

---

## 6. File Summary

### New Files
| File | Purpose |
|------|---------|
| `src/collections/AdmissionRequests/index.ts` | Collection definition |
| `src/collections/AdmissionRequests/hooks/processAdmissionApproval.ts` | Approval automation hook |
| `src/app/api/admission-request/route.ts` | Public API endpoint |
| `src/app/(frontend)/(website)/forms/admission/AdmissionForm.tsx` | Multi-step form component |
| `src/app/(frontend)/(website)/forms/admission/schema.ts` | Zod validation |
| `src/app/(frontend)/(website)/forms/admission/actions.ts` | Server actions |

### Modified Files
| File | Change |
|------|--------|
| `src/collections/index.ts` | Import + register AdmissionRequests |
| `src/collections/FeeReceipts/index.ts` | Add enrollment, installmentNumber, admissionRequest fields |
| `src/collections/Enrollments/index.ts` | Add feeReceipts join field |
| `src/app/(frontend)/(website)/forms/admission/page.tsx` | Replace with new server wrapper |
| `src/app/(frontend)/(website)/forms/page.tsx` | Update admission card description |

---

## 7. Migration

After making collection changes:
```bash
pnpm generate:types
pnpm migrate:create --name admission_requests
# Review generated SQL
pnpm migrate:run
pnpm migrate:status
```

Migration will create:
- `admission_requests` table
- `admission_requests_installments` table (for array field)
- 3 new columns on `fee_receipts` (enrollment_id, installment_number, admission_request_id)

---

## 8. Verification

1. Visit `/admin` -> "Admission Requests" appears under "Academic Operations"
2. Visit `/forms/admission` -> multi-step form loads with course options
3. Submit form -> AdmissionRequest created with status=pending
4. In admin: assign batch, add installment plan, set status=approved
5. Verify auto-created: User (check Users), Student (check Students), Enrollment (check Enrollments), FeeReceipts (one per installment)
6. Check "Processing Results" tab shows linked records
7. If Lead was linked, verify Lead stage updated to ENROLLED
