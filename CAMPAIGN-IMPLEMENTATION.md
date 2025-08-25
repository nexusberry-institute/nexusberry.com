# Campaign & UTM Implementation — summary, files, flow, and tests

This document summarizes the campaign/UTM changes, where they live, why they were added, the runtime flow (page-visit and registration), and how to verify behavior. Put in repo root so team members can quickly understand what changed.

## Goals
- Track which marketing campaign brought a visitor (UTM).
- Store campaign reference on successful event registration.
- Keep a default participants number per event (100) and maintain a live count: `defaultParticipants + actualRegistrations`.
- Provide both page-load (visitor) and registration (conversion) tracking while validating UTMs server-side.

## High-level flow
1. Ad click → user lands on event page with UTM query param (e.g. `?utm=12345`).
<!-- 2. Optional client-side tracking: `UTMTracker` posts to `/api/campaigns/track-visit` to increment `campaigns.visitorCount` (page visit). -->
3. User fills registration form. The form extracts UTM from URL and includes it in the registration request to server-side action `CreateEventRegistration`.
4. Server action validates UTM: if a UTM is provided but no matching campaign is found, registration is rejected.
5. On successful registration: server attaches `campaign` relation to the `event-registration`, increments `events.actualRegistrations`, and increments `campaigns.visitorCount` (conversion).
6. Frontend displays live participant count as `event.defaultParticipants + event.actualRegistrations`.

## Files added / changed (important paths)
- Collections (Payload)
  - `src/collections/Campaigns/index.ts` — NEW collection `campaigns` (fields: `name`, `platform`, `startDate`, `endDate`, `budget`, `utm`, `events`, `visitorCount`).
  - `src/collections/Events/index.ts` — UPDATED: added fields `defaultParticipants` (default 100) and `actualRegistrations` (default 0).
  - `src/collections/EventRegistrations/index.ts` — UPDATED: added `campaign` relationship field and retained existing email-sending `afterChange` hook.

- Frontend / Server Actions
  - `src/app/(frontend)/(website)/events/[slug]/_components/UTMTracker.tsx` — (client) reads URL params (`utm`, `utm_campaign`, `utm_source`) and POSTs to `/api/campaigns/track-visit` (fire-and-forget). This is optional and idempotent behavior was recommended.
  - `src/pages/api/campaigns/track-visit.ts` — (server API) receives `{ utm }`, finds matching campaign, increments `visitorCount`. Uses safe casts (`payload as any`) to avoid strict typing issues in this project.
  - `src/app/(frontend)/(website)/events/[slug]/_components/ModelForm.tsx` — registration form: now extracts UTM from current page URL and includes `utm` in payload sent to server action.
  - `src/app/(frontend)/(website)/events/[slug]/_components/ServerActions.ts` — server action `CreateEventRegistration` accepts optional `utm`; validates the UTM against `campaigns` collection; rejects if UTM present but invalid; attaches `campaign` to registration (if none exists yet) and increments `events.actualRegistrations` and `campaigns.visitorCount` on successful registration. It also prevents duplicate registrations for same event/phone.

- UI
  - `src/app/(frontend)/(website)/events/[slug]/_components/Hero.tsx` — now accepts `attendee` (participant count) prop and displays the computed number instead of a static value.
  - `src/app/(frontend)/(website)/events/[slug]/page.tsx` — computes `participantCount = (event.defaultParticipants || 0) + (event.actualRegistrations || 0)` and passes it to `Hero`.

## Key implementation details and decisions
- UTM names recognized (client-side & server-side): `utm`, `utm_campaign`, `utm_source`.
- Validation: if client includes `utm` in registration request and the server cannot find a matching campaign, the registration is rejected with `Invalid campaign UTM provided.` This enforces data integrity.
- TypeScript / Payload typing: several server-side calls use `(payload as any)` and some `id as any` casts to avoid compile-time CollectionSlug overload issues in this codebase. These are conservative runtime-safe workarounds; consider regenerating Payload types after the import-map/types generation issues are resolved.
- Idempotency: to avoid double-counting page visits, the client-side `UTMTracker` should set a local key (localStorage) after a successful call; server-side registration checks for existing registrations by `phoneNumber` and prevents double incrementing `events.actualRegistrations` for already-registered phone/event combinations.

## How to test (manual)
1. Create a campaign in the admin with a unique UTM (e.g. `1234567`) and link the event.
2. Visit event page with a valid utm (example):
   - `http://localhost:3000/events/<slug>?utm=1234567`
3. Confirm page-load visitor tracking (optional):
   - If `UTMTracker` is enabled and not blocked by idempotency, the campaign's `Visitor Count` should increase by 1 (check admin or query API).
   - Or manually run:

```
curl -X POST http://localhost:3000/api/campaigns/track-visit \
  -H 'Content-Type: application/json' \
  -d '{"utm":"1234567","slug":"<slug>"}'
```

4. Submit registration using event form (ensure URL still contains the utm param so the form will include it). After successful registration:
   - `event-registrations` document should have `campaign` set to the campaign ID.
   - `events.actualRegistrations` should increment by 1.
   - `campaigns.visitorCount` should increment by 1 (conversion).

5. Test invalid UTM:
   - Submit registration with `?utm=invalid` → server should reject and return `Invalid campaign UTM provided.`

## Verification queries (Payload server / direct DB)
- Check campaign by utm:
```js
const payload = await getPayload({ config })
const campaign = await payload.find({ collection: 'campaigns', where: { utm: { equals: '1234567' } }, limit: 1 })
```
- Check event counts:
```js
const ev = await payload.findByID({ collection: 'events', id: <eventId> })
console.log(ev.defaultParticipants, ev.actualRegistrations)
```

## Edge cases and recommended improvements
- Add per-session or per-email idempotency for page-visit counting (UTMTracker) — localStorage cookie or server-side per-IP/session check.
- Consider storing the full campaign+event mapping in the registration so analytics queries are easier (e.g., store campaign slug or utm as a plain field alongside relation).
- Add a small admin dashboard (or report) to aggregate registrations by campaign and compute conversion rates and cost-per-registration.
- Regenerate payload import-map and types after all collection files are final to remove the `any` casts and stronger typing.

## Notes for maintainers
- Removing `UTMTracker` is safe if you only want server-side tracking on registration; if you keep it, make it idempotent.
- Be cautious when changing collection slugs: `relationTo` values must match exactly and collections must be exported and included in `src/collections/index.ts`.

---
If you want, I can also:
- add idempotent localStorage logic to the current `UTMTracker` file,
- patch `ServerActions` to avoid updating a registration's `campaign` if it already exists (already implemented),
- add a small script to batch-migrate existing events to set `defaultParticipants: 100` where missing.

