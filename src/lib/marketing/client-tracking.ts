// Client-side tracking helper
// lib/marketing/client-tracking.ts

export class ClientTracking {
  private static getClientId(): string {
    // Try enhanced data first
    if (window.fbTrackingData?.clientId) {
      return window.fbTrackingData.clientId;
    }

    // Fallback method
    // Get GA4 client ID
    return window.gtag?.('get', 'GA_MEASUREMENT_ID', 'client_id') ||
      crypto.randomUUID();
  }

  private static getFacebookData() {
    // Try to get from the enhanced data first
    if (window.fbTrackingData) {
      return {
        fbp: window.fbTrackingData.fbp,
        fbc: window.fbTrackingData.fbc
      };
    }
    // Fallback to reading cookies directly
    // Get Facebook pixel data from cookies
    const fbp = document.cookie
      .split('; ')
      .find(row => row.startsWith('_fbp='))
      ?.split('=')[1];

    const fbc = document.cookie
      .split('; ')
      .find(row => row.startsWith('_fbc='))
      ?.split('=')[1];

    return { fbp, fbc };
  }

  static async trackPageView(pageUrl?: string) {
    try {
      const { fbp, fbc } = this.getFacebookData();
      const clientId = this.getClientId();

      await fetch('/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          fbp,
          fbc,
          page_url: pageUrl || window.location.href
        })
      });
    } catch (error) {
      console.error('Client pageview tracking error:', error);
    }
  }

  static async trackFormSubmit(formData: any) {
    try {
      const { fbp, fbc } = this.getFacebookData();
      const clientId = this.getClientId();

      await fetch('/api/track/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId,
          fbp,
          fbc,
          page_url: window.location.href
        })
      });
    } catch (error) {
      console.error('Client form submit tracking error:', error);
    }
  }

  // Example: Form component for trackFormSubmit
  // 'use client';
  // import { ClientTracking } from '@/lib/client-tracking';

  // export default function ContactForm() {
  //   const handleSubmit = async (formData: FormData) => {
  //     // Your form submission logic here

  //     // Track the conversion
  //     await ClientTracking.trackFormSubmit({
  //       email: formData.get('email'),
  //       firstName: formData.get('firstName'),
  //       lastName: formData.get('lastName'),
  //       phone: formData.get('phone'),
  //       formType: 'contact'
  //     });
  //   };

  //   return (
  //     <form action={handleSubmit}>
  //       {/* Your form fields */}
  //     </form>
  //   );
  // }

  static async trackEventAttended(eventData: any) {
    try {
      const { fbp, fbc } = this.getFacebookData();
      const clientId = this.getClientId();

      await fetch('/api/track/event-attended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          clientId,
          fbp,
          fbc,
          page_url: window.location.href
        })
      });
    } catch (error) {
      console.error('Client event attended tracking error:', error);
    }
  }

  // Example: Page component for event attendance for trackEventAttended
  // 'use client';
  // import { useEffect } from 'react';
  // import { ClientTracking } from '@/lib/client-tracking';

  // export default function EventPage({ params }: { params: { slug: string } }) {
  //   useEffect(() => {
  //     // Track page view
  //     ClientTracking.trackPageView();
  //   }, []);

  //   const handleEventAttendance = async (eventData: any) => {
  //     await ClientTracking.trackEventAttended({
  //       email: eventData.email,
  //       eventName: params.slug,
  //       eventDate: new Date().toISOString()
  //     });
  //   };

  //   return (
  //     <div>
  //       {/* Your event page content */}
  //     </div>
  //   );
  // }

  static async trackAdmission(admissionData: any) {
    try {
      const { fbp, fbc } = this.getFacebookData();
      const clientId = this.getClientId();

      await fetch('/api/track/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...admissionData,
          clientId,
          fbp,
          fbc,
          page_url: window.location.href
        })
      });
    } catch (error) {
      console.error('Client admission tracking error:', error);
    }
  }
}

