// 1. Utility functions for tracking
// lib/tracking-utils.ts
import crypto from 'crypto';

export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string; // Facebook browser ID
  fbc?: string; // Facebook click ID
}

export interface EventData {
  eventName: string;
  eventTime: number;
  userData: UserData;
  customData?: Record<string, any>;
  eventSourceUrl?: string;
  actionSource: 'website' | 'email' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other';
}

// Hash user data for privacy
export function hashUserData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

// Extract client info from request
export function extractClientInfo(request: Request) {
  const headers = request.headers;
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = headers.get('user-agent') || '';

  return { ip, userAgent };
}