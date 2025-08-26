# Registration System Update Documentation

## Overview
The registration system has been completely restructured to use a **single source of truth** approach where all registrations are managed through the `Leads` collection, with automatic statistics tracking and email notifications.

## Key Changes Made

### ✅ **Removed Dependencies**
- **EventRegistrations Collection**: Still exists but completely disconnected from the active workflow
- **Manual Statistics Tracking**: All statistics are now auto-calculated via hooks

### ✅ **Enhanced Collections**
- **Leads**: Primary registration hub with multi-event and multi-campaign support
- **Events**: Auto-calculated statistics with lead relationship view
- **Campaigns**: Auto-calculated conversion metrics from related events

## Registration Flow Explained

### 1. **Frontend Registration (ModelForm.tsx)**
```typescript
User fills form → FormData {
  name: "John Doe",
  email: "john@example.com", 
  phoneNumber: "+1234567890",
  events: 2, // Event ID
  // Separate UTM parameters extracted from URL
  utm_source: "facebook", 
  utm_campaign: "summer_sale",
  utm_medium: "cpc",
  utm_content: "banner_ad",
  utm: "legacy_utm_code" // Legacy field for backward compatibility
}
```

### 2. **Server Action Processing (ServerActions.ts)**

#### **Step A: Campaign Lookup**
```typescript
if (any UTM parameters provided) {
  → Search campaigns by matching ANY UTM field (utm_source, utm_campaign, utm_medium, utm_content, or legacy utm)
  → If specific campaign found → Use that campaign
  → If no campaign found but UTM params exist → Create/Use "General UTM Traffic" campaign
  → If no UTM params → No campaign assignment (direct registration)
}
```

#### **Step B: Existing Lead Check**
```typescript
Search leads by phoneNumber → {
  if (lead exists) {
    → Check if already registered for this event
    → If yes → Return "already registered" error
    → If no → Add event to existing events array
    → Add campaign to campaigns array (if not already present)
    → Update lead record
  }
  else {
    → Create new lead with event and campaign arrays
  }
}
```

### 3. **Backend Processing (Collection Hooks)**

#### **Leads Collection Hooks (Automatic)**
```typescript
After Create/Update Lead → {
  // Email Hook
  → Send registration confirmation email
  
  // Statistics Hook  
  → For each NEW event added:
    → Increment event.actualRegistrations += 1
    → If lead has campaign: Increment event.campaignVisitors += 1
}
```

#### **Events Collection Hooks (Automatic)**
```typescript
After Event Statistics Update → {
  → Find all campaigns containing this event
  → Recalculate campaign.combinedRegistrations
  → Recalculate campaign.combinedCampaignConversions
}
```

## Collection Structure & Relationships

### **Leads Collection** (Primary Hub)
```typescript
Lead {
  name: string
  email: string  
  mobile: string
  events: Event[] // Multiple events support
  campaigns: Campaign[] // Multiple campaigns support
  hasAttended: boolean // For post-event tracking
}
```

### **Events Collection** (Auto-calculated Stats)
```typescript
Event {
  title: string
  actualRegistrations: number // Auto-calculated (read-only)
  campaignVisitors: number // Auto-calculated (read-only) 
  
  // Admin View
  tabs: [
    "Event Details",
    "Event Leads" // Shows all leads registered for this event
  ]
}
```

### **Campaigns Collection** (Auto-calculated Stats + UTM Tracking)
```typescript
Campaign {
  // Basic Info (Tab 1: Campaign Info)
  name: string
  platform: string
  startDate: date
  endDate: date
  budget: number
  events: Event[] // Multiple events in campaign
  
  // UTM Tracking (Tab 2: UTM Tracking)
  utm_source: string // e.g., "facebook", "google", "newsletter"
  utm_campaign: string // e.g., "spring_sale", "webinar_promo"
  utm_medium: string // e.g., "cpc", "banner", "email"
  utm_content: string // e.g., "logolink", "textlink", "header_banner"
  utm: string // Legacy UTM field for backward compatibility
  
  // Auto-calculated fields (read-only)
  combinedRegistrations: number // Total registrations across all events
  combinedCampaignConversions: number // Total UTM-based registrations
  
  // Admin View (Tab 3: Campaign Leads)
  campaignLeads: Lead[] // Virtual join showing all leads from this campaign
}
```

## Data Flow Example

### **Scenario**: User registers for "AI Workshop" via "Summer Campaign"

```mermaid
User Registration (with UTM: ?utm_source=facebook&utm_campaign=summer_sale&utm_medium=cpc)
       ↓
1. ModelForm.tsx extracts UTM parameters:
   ├── utm_source: "facebook"
   ├── utm_campaign: "summer_sale"
   ├── utm_medium: "cpc"
   └── events: "AI Workshop ID"
       ↓
2. ServerActions.ts processes:
   ├── Searches campaigns by ANY UTM field match
   ├── Finds "Summer Campaign" (matches utm_campaign: "summer_sale")
   ├── Checks if user exists by phone
   ├── Creates/Updates lead with event & campaign
       ↓
3. Leads Hooks trigger:
   ├── Sends confirmation email
   ├── Updates "AI Workshop" statistics:
   │   ├── actualRegistrations: 45 → 46
   │   └── campaignVisitors: 12 → 13
       ↓
4. Campaign Hooks trigger:
   └── Updates "Summer Campaign" statistics:
       ├── combinedRegistrations: 89 → 90
       └── combinedCampaignConversions: 23 → 24
```

## Admin Dashboard Benefits

### **For Event Managers**
- ✅ **Event Leads Tab**: View all registered leads with attendance tracking
- ✅ **Real-time Stats**: See registration counts update automatically
- ✅ **Campaign Performance**: See how many came via UTM vs direct

### **For Campaign Managers**  
- ✅ **Advanced UTM Tracking**: Separate fields for utm_source, utm_campaign, utm_medium, utm_content
- ✅ **Flexible Campaign Matching**: System finds campaigns by ANY UTM parameter match
- ✅ **Auto-fallback System**: Creates "General UTM Traffic" campaign for unmatched UTM traffic
- ✅ **ROI Tracking**: See actual conversions, not just clicks
- ✅ **Multi-Event Campaigns**: Combined statistics across all campaign events
- ✅ **Lead Attribution**: See which leads came from which campaigns
- ✅ **Campaign Leads Tab**: Direct view of all leads attributed to each campaign

### **For Lead Management**
- ✅ **Complete History**: See all events a lead has registered for
- ✅ **Multi-Campaign Tracking**: Track leads across multiple campaigns
- ✅ **Attendance Tracking**: Mark who actually attended events

## Key Advantages

1. **No Duplicate Registrations**: System prevents same person registering twice for same event
2. **Multi-Event Support**: One lead can register for multiple events seamlessly  
3. **Advanced Campaign Attribution**: Granular UTM tracking with flexible matching
4. **Graceful UTM Handling**: Never rejects registrations - creates fallback campaigns when needed
5. **Automatic Statistics**: No manual counting, everything updates in real-time
6. **Email Integration**: Confirmation emails sent automatically
7. **Data Integrity**: Single source of truth prevents inconsistencies
8. **Campaign Flexibility**: Matches campaigns by ANY UTM parameter for maximum attribution

## UTM Parameter Handling & Campaign Logic

### **UTM Parameter Extraction**
The system extracts the following UTM parameters from the registration URL:
- `utm_source`: Traffic source (e.g., facebook, google, newsletter)
- `utm_campaign`: Campaign identifier (e.g., spring_sale, webinar_promo)
- `utm_medium`: Marketing medium (e.g., cpc, banner, email)
- `utm_content`: Specific content (e.g., logolink, textlink, header_banner)
- `utm`: Legacy UTM field for backward compatibility

### **Campaign Matching Logic**
```typescript
1. If ANY UTM parameter is present:
   ├── Search existing campaigns for match on ANY UTM field
   ├── If match found → Use existing campaign
   ├── If no match found → Create/Use "General UTM Traffic" campaign
   └── Assign lead to matched/fallback campaign

2. If NO UTM parameters:
   └── Register lead without campaign (direct registration)
```

### **Fallback Campaign Creation**
When UTM parameters exist but no matching campaign is found:
```typescript
Campaign: "General UTM Traffic" {
  name: "General UTM Traffic",
  platform: "Mixed",
  utm_source: data.utm_source || "unknown",
  utm_campaign: data.utm_campaign || "general", 
  utm_medium: data.utm_medium || "unknown",
  utm_content: data.utm_content || "unknown",
  utm: data.utm || "general-utm"
}
```

### **Benefits of This Approach**
- ✅ **Never Loses Traffic**: No registration is rejected due to UTM issues
- ✅ **Flexible Matching**: Campaigns can be found by any UTM component
- ✅ **Automatic Organization**: Unknown UTM traffic gets categorized
- ✅ **Data Preservation**: All UTM data is preserved for analysis

## Campaign Collection Admin Interface

### **Tab 1: Campaign Info**
- Basic campaign details (name, platform, dates, budget)
- Event relationships and auto-calculated statistics
- Combined registration and conversion metrics

### **Tab 2: UTM Tracking**
- Separate fields for each UTM parameter
- Detailed descriptions for proper UTM usage
- Legacy UTM field for backward compatibility

### **Tab 3: Campaign Leads**
- Virtual join showing all leads attributed to this campaign
- Real-time view of campaign effectiveness
- Export and analysis capabilities
- Direct lead management from campaign interface

## Technical Implementation Notes

- **Hook-based Architecture**: All statistics and emails handled via Payload hooks
- **Relationship Management**: Join fields provide easy data access
- **Access Control**: Proper permissions for all collections
- **Error Handling**: Graceful failures with user-friendly messages
- **Type Safety**: Full TypeScript support with proper type definitions