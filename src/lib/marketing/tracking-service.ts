// 4. Main tracking service
// lib/tracking-service.ts
import { facebookAPI } from './facebook-conversions-api';
import { googleAnalyticsAPI } from './google-analytics-api';
import { EventData } from './tracking-utils';

export class TrackingService {
  async trackFunnelEvent(
    stage: 'pageview' | 'form_submitted' | 'event_attended' | 'admission',
    userData: any,
    customData?: Record<string, any>,
    clientId?: string
  ) {
    const eventTime = Date.now();

    // Map funnel stages to Facebook events
    const fbEventMap = {
      'pageview': 'PageView',
      'form_submitted': 'Lead',
      'event_attended': 'CompleteRegistration',
      'admission': 'Purchase'
    };

    // Map funnel stages to GA4 events
    const ga4EventMap = {
      'pageview': 'page_view',
      'form_submitted': 'generate_lead',
      'event_attended': 'sign_up',
      'admission': 'purchase'
    };

    const eventData: EventData = {
      eventName: fbEventMap[stage],
      eventTime,
      userData,
      customData,
      eventSourceUrl: customData?.page_url || process.env.NEXT_PUBLIC_DOMAIN,
      actionSource: 'website'
    };

    // Track on Facebook
    await facebookAPI.trackEvent(eventData);

    // Track on Google Analytics
    if (clientId) {
      const ga4EventData = {
        ...eventData,
        eventName: ga4EventMap[stage]
      };
      await googleAnalyticsAPI.trackEvent(clientId, ga4EventData);
    }
  }
}

export const trackingService = new TrackingService();