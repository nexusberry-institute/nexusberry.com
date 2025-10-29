// Usage: node scripts/meta-capi-server-side.js
// Verify in Meta Events Manager (Test Events)
// - Keep the Test Events tab open before sending the request (the code is session-bound).
// - After each cURL:
// - A new event should appear with the mapped name:
// - form_submitted → Lead (or your mapping)
// - interested → Interested (custom)
// - event_attended → EventAttended (custom)
// - admission → Admission (custom)
// - Check “Match Quality” and “Received Parameters.”
// - For server-only tests, fbp/fbc may be missing (normal).
// - PII fields will appear hashed if you’re hashing on server (expected).
// When done testing, remove metaTestEventCode from production calls.

// Repeat with eventName set to interested, event_attended, admission. Keep the same eventId if you want to test deduplication across multiple transports; otherwise, use unique IDs per logical event.

import { randomUUID } from "node:crypto"

const DOMAIN = "https://www.nexusberry.com"
const TEST_EVENT_CODE = "TEST13541"
// const eventName = "lead"
// const eventName = "interested"
// const eventName = "event_attended"
const eventName = "purchase"

async function main() {
  const url = `${DOMAIN.replace(/\/$/, "")}/api/track`

  // Payload mirrors your cURL example
  const payload = {
    eventName: eventName,
    campaignId: "CAMP-123",
    eventId: "evt-abc-001" || `evt-${randomUUID()}`, // keep your fixed ID; change if you want unique IDs
    eventSourceUrl: `${DOMAIN.replace(/\/$/, "")}/lead-form`,
    actionSource: "system_generated",
    user: {
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+1 (555) 011-2233",
      city: "London",
      state: "LDN",
      country: "GB",
      externalId: "lead-1001",
    },
    customData: {
      lead_source: "website",
      product: "Workshop",
      value: 50,
      currency: 'USD',
    },
    metaTestEventCode: TEST_EVENT_CODE,
  }

  console.log("[v0] POST", url)
  console.log("[v0] Payload:", JSON.stringify(payload, null, 2))

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { raw: text }
    }

    console.log("[v0] Status:", res.status)
    console.log("[v0] Response:", parsed)
  } catch (err) {
    console.error("[v0] Request failed:", err?.message || err)
    process.exitCode = 1
  }
}

main()