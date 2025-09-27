// PayloadCMS Integration (if using PayloadCMS for form handling)
// payload/hooks/trackingHooks.ts
import { trackingService } from '@/lib/marketing/tracking-service';
import type { CollectionAfterChangeHook } from 'payload';

// Hook for tracking form submissions in PayloadCMS
export const trackFormSubmission: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection
}) => {
  if (operation === 'create' && collection.slug === 'form-submissions') {
    try {
      const clientInfo = {
        ip: req.ip || req.socket?.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      await trackingService.trackFunnelEvent(
        'form_submitted',
        {
          email: doc.email,
          firstName: doc.firstName,
          lastName: doc.lastName,
          phone: doc.phone,
          ...clientInfo,
          fbp: req.cookies?._fbp,
          fbc: req.cookies?._fbc
        },
        {
          form_type: doc.formType || collection.slug,
          page_url: doc.sourceUrl || req.get('Referer')
        },
        req.cookies?._ga || req.cookies['_ga_' + process.env.GA4_MEASUREMENT_ID?.replace('G-', '')]
      );
    } catch (error) {
      console.error('PayloadCMS tracking hook error:', error);
    }
  }
};

// Hook for tracking event attendance
export const trackEventAttendance: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection
}) => {
  if (operation === 'create' && collection.slug === 'event-attendees') {
    try {
      const clientInfo = {
        ip: req.ip || req.socket?.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      await trackingService.trackFunnelEvent(
        'event_attended',
        {
          email: doc.email,
          ...clientInfo,
          fbp: req.cookies?._fbp,
          fbc: req.cookies?._fbc
        },
        {
          event_name: doc.eventName,
          event_date: doc.eventDate,
          page_url: req.get('Referer')
        },
        req.cookies?._ga
      );
    } catch (error) {
      console.error('PayloadCMS event tracking hook error:', error);
    }
  }
};

// Hook for tracking admissions
export const trackAdmission: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection
}) => {
  if (operation === 'create' && collection.slug === 'admissions') {
    try {
      const clientInfo = {
        ip: req.ip || req.socket?.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      await trackingService.trackFunnelEvent(
        'admission',
        {
          email: doc.email,
          ...clientInfo,
          fbp: req.cookies?._fbp,
          fbc: req.cookies?._fbc
        },
        {
          admission_type: doc.admissionType,
          value: doc.value,
          currency: doc.currency || 'USD',
          page_url: req.get('Referer')
        },
        req.cookies?._ga
      );
    } catch (error) {
      console.error('PayloadCMS admission tracking hook error:', error);
    }
  }
};
