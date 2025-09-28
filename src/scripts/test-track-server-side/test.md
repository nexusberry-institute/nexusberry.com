Test plan: Server-only funnel events for Next.js + Payload CMS

Use this to validate your end-to-end server events for:
form_submitted → interested → event_attended → admission

## 0) Prerequisites

- Environment variables set in your project

- META_PIXEL_ID
- META_CAPI_ACCESS_TOKEN
- GA4_MEASUREMENT_ID
- GA4_API_SECRET
- PUBLIC_APP_URL (e.g., [https://www.yourdomain.com](https://www.yourdomain.com))



- Your Next.js route deployed: POST [https://yourdomain.com/api/track](https://yourdomain.com/api/track)
- Meta Events Manager → Test Events tab open (copy the Test Event Code)
- GA4 access (Realtime and DebugView)


Tip: For testing, set actionSource in the payload:

- From website/browser: "website"
- From Payload hook (server-only): "system_generated" (or "app")


---

## 1) Smoke-test the API route (direct)

Use cURL or Postman to confirm the route works and credentials are valid.
Replace values in ALL_CAPS.

Form submitted (server call):

```shellscript
curl -X POST "https://YOUR_DOMAIN.com/api/track" \
  -H "content-type: application/json" \
  -d '{
    "eventName": "form_submitted",
    "campaignId": "CAMP-123",
    "eventId": "evt-abc-001",
    "eventSourceUrl": "https://YOUR_DOMAIN.com/lead-form",
    "actionSource": "system_generated",
    "user": {
      "fullName": "Ada Lovelace",
      "email": "ada@example.com",
      "phone": "+1 (555) 011-2233",
      "city": "London",
      "state": "LDN",
      "country": "GB",
      "externalId": "lead-1001"
    },
    "customData": {
      "lead_source": "website",
      "product": "Workshop"
    },
    "metaTestEventCode": "YOUR_META_TEST_EVENT_CODE"
  }'
```

Expected response (200):

- ok: true
- forwarded.meta: response object from Meta (no errors)
- forwarded.ga4.status: 204


Repeat with eventName set to interested, event_attended, admission. Keep the same eventId if you want to test deduplication across multiple transports; otherwise, use unique IDs per logical event.

---

## 2) Verify in Meta Events Manager (Test Events)

- Keep the Test Events tab open before sending the request (the code is session-bound).
- After each cURL:

- A new event should appear with the mapped name:

- form_submitted → Lead (or your mapping)
- interested → Interested (custom)
- event_attended → EventAttended (custom)
- admission → Admission (custom)






- Check “Match Quality” and “Received Parameters.”

- For server-only tests, fbp/fbc may be missing (normal).
- PII fields will appear hashed if you’re hashing on server (expected).





When done testing, remove metaTestEventCode from production calls.

---

## 3) Validate GA4 delivery

Option A — Realtime report (no code changes)

- Open GA4 → Realtime → Events
- Send your test requests; within a couple minutes, you should see your event names (form_submitted, interested, event_attended, admission).


Option B — Validate payload (optional, direct to GA4 debug endpoint)

- To validate your GA4 credentials and payload independently of your route, call:


```shellscript
curl -X POST "https://www.google-analytics.com/debug/mp/collect?measurement_id=GA4_MEASUREMENT_ID&api_secret=GA4_API_SECRET" \
  -H "content-type: application/json" \
  -d '{
    "client_id": "test.123456",
    "events": [
      { "name": "form_submitted", "params": { "page_location": "https://YOUR_DOMAIN.com/lead-form", "debug_mode": 1 } }
    ]
  }'
```

- You’ll get validation messages in the response. If valid, repeat your real test via your route and check Realtime.


---

## 4) Test from the browser (website-origin call)

Open your site in a new tab and run this in the DevTools console:

```javascript
(function(){
  const payload = {
    eventName: 'form_submitted',
    campaignId: 'CAMP-123',
    eventId: 'evt-browser-001',
    eventSourceUrl: location.href,
    actionSource: 'website',
    user: {
      email: 'ada@example.com',
      fullName: 'Ada Lovelace',
      phone: '+1 (555) 011-2233'
    },
    metaTestEventCode: 'YOUR_META_TEST_EVENT_CODE'
  };
  const body = JSON.stringify(payload);
  const url = '/api/track';
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
  } else {
    fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true });
  }
})();
```

Why this test is useful:

- It provides real client_ip_address and client_user_agent to Meta.
- If the user reached the page via a Facebook ad, the _fbc cookie may be present and forwarded by your API route if you read cookies from the request.


Check Meta Test Events again; you should see events with action_source = website.

---

## 5) Test from Payload CMS (server-only hooks)

For each collection/hook you added:

1. Ensure the hook sets:

1. eventName correctly (form_submitted, interested, event_attended, admission)
2. actionSource: "system_generated"
3. metaTestEventCode during testing
4. user fields (email/phone/fullName/externalId) if available
5. eventSourceUrl (e.g., PUBLIC_APP_URL + '/admin' or meaningful URL)
6. customData as needed



2. Trigger the hook:

1. form_submitted: create or update a lead as “submitted”
2. interested: update the record to interested state
3. event_attended: mark attendance true
4. admission: flip admitted to true



3. Watch Meta Test Events:

1. Confirm each event arrives
2. Check that the action source and hashed fields are present



4. GA4 Realtime:

1. Confirm events appear with your names





Tip: During testing, add a temporary “test” flag (e.g., doc.isTest) to ensure hooks only send when set, and remove afterward.

---

## 6) Expected behaviors and troubleshooting

- fbc is null:

- Normal unless the user arrived via a Facebook ad (fbclid present). Server-only hooks won’t have browser fbclid, so _fbc typically won’t be present.



- Missing client_ip_address/client_user_agent on server-only:

- Expected. Meta can still match using hashed PII and other signals. Always provide actionSource.



- 200 OK but no event in Meta:

- Make sure you included metaTestEventCode while the Test Events tab is open.
- Check Meta response JSON in your API reply (forwarded.meta). Look for error messages.



- GA4 not visible:

- Wait up to a few minutes and check Realtime.
- Use the debug endpoint (Section 3, Option B) to validate credentials and payload.



- Duplicates:

- Use stable eventId per logical event (e.g., application ID + stage name) to help deduplicate, especially if you later add browser-side events.



- Consent considerations:

- Server-only events are not blocked by browser consent; ensure your privacy policy covers server-side processing.





---

## 7) Sample payloads you can reuse

Form submitted (server-only):

```json
{
  "eventName": "form_submitted",
  "campaignId": "CAMP-123",
  "eventId": "lead-1001-form",
  "eventSourceUrl": "https://YOUR_DOMAIN.com/admin",
  "actionSource": "system_generated",
  "user": {
    "fullName": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "+15550112233",
    "city": "London",
    "state": "LDN",
    "country": "GB",
    "externalId": "lead-1001"
  },
  "customData": { "product": "Bootcamp" },
  "metaTestEventCode": "YOUR_META_TEST_EVENT_CODE"
}
```

Interested:

```json
{
  "eventName": "interested",
  "eventId": "lead-1001-interested",
  "actionSource": "system_generated",
  "user": { "email": "ada@example.com", "externalId": "lead-1001" },
  "customData": { "interest_score": 85 },
  "metaTestEventCode": "YOUR_META_TEST_EVENT_CODE"
}
```

Event attended:

```json
{
  "eventName": "event_attended",
  "eventId": "lead-1001-attended",
  "actionSource": "system_generated",
  "user": { "email": "ada@example.com", "externalId": "lead-1001" },
  "customData": { "event_code": "DS-WS-27SEP" },
  "metaTestEventCode": "YOUR_META_TEST_EVENT_CODE"
}
```

Admission:

```json
{
  "eventName": "admission",
  "eventId": "lead-1001-admission",
  "actionSource": "system_generated",
  "user": { "email": "ada@example.com", "externalId": "lead-1001" },
  "customData": { "cohort": "Oct-2025" },
  "metaTestEventCode": "YOUR_META_TEST_EVENT_CODE"
}
```

---

## 8) Acceptance criteria

- Each stage appears in Meta Test Events with the correct name and action source.
- GA4 Realtime shows the same events within a few minutes.
- Deduplication strategy (eventId) defined and consistent.
- Payload hooks fire exactly once per state transition.
- After testing, you remove metaTestEventCode from production calls.


If you share a sample response from /api/track and a screenshot from Meta Test Events for one of the stages, I can confirm field mapping and suggest any final tweaks before go‑live.