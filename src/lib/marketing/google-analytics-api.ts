// 5. Google Analytics 4 Measurement Protocol Service  

import { EventData, hashUserData } from "./tracking-utils";

// lib/google-analytics-api.ts
class GoogleAnalyticsAPI {
  private measurementId: string;
  private apiSecret: string;

  constructor() {
    this.measurementId = process.env.GA4_MEASUREMENT_ID!;
    this.apiSecret = process.env.GA4_API_SECRET!;
  }

  async trackEvent(clientId: string, eventData: EventData): Promise<void> {
    try {
      const payload = {
        client_id: clientId,
        events: [{
          name: eventData.eventName,
          params: {
            page_location: eventData.eventSourceUrl,
            user_id: eventData.userData.email ? hashUserData(eventData.userData.email) : undefined,
            ...eventData.customData
          }
        }]
      };

      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`GA4 API error: ${response.status}`);
      }

      console.log('Google Analytics event tracked');
    } catch (error) {
      console.error('Google Analytics API error:', error);
    }
  }
}

export const googleAnalyticsAPI = new GoogleAnalyticsAPI();
