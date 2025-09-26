// 2. Facebook Conversions API Service
// lib/facebook-conversions-api.ts
import { FacebookAdsApi, ServerEvent, EventRequest, UserData as FBUserData, CustomData } from 'facebook-nodejs-business-sdk';
import { EventData, hashUserData } from './tracking-utils';

class FacebookConversionsAPI {
  private pixelId: string;
  private accessToken: string;

  constructor() {
    this.pixelId = process.env.FACEBOOK_PIXEL_ID!;
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN!;

    FacebookAdsApi.init(this.accessToken);
  }

  async trackEvent(eventData: EventData): Promise<void> {
    try {
      const userData = new FBUserData();

      // Hash and set user data
      if (eventData.userData.email) {
        userData.setEmail(hashUserData(eventData.userData.email));
      }
      if (eventData.userData.phone) {
        userData.setPhone(hashUserData(eventData.userData.phone));
      }
      if (eventData.userData.firstName) {
        userData.setFirstName(hashUserData(eventData.userData.firstName));
      }
      if (eventData.userData.lastName) {
        userData.setLastName(hashUserData(eventData.userData.lastName));
      }
      if (eventData.userData.city) {
        userData.setCity(hashUserData(eventData.userData.city));
      }
      if (eventData.userData.state) {
        userData.setState(hashUserData(eventData.userData.state));
      }
      if (eventData.userData.country) {
        userData.setCountryCode(hashUserData(eventData.userData.country));
      }
      if (eventData.userData.zipCode) {
        userData.setZipCode(hashUserData(eventData.userData.zipCode));
      }

      userData.setClientIpAddress(eventData.userData.ip);
      userData.setClientUserAgent(eventData.userData.userAgent);
      userData.setFbp(eventData.userData.fbp);
      userData.setFbc(eventData.userData.fbc);

      const customData = new CustomData();
      if (eventData.customData) {
        Object.entries(eventData.customData).forEach(([key, value]) => {
          customData.setCustomProperty(key, value);
        });
      }

      const serverEvent = new ServerEvent()
        .setEventName(eventData.eventName)
        .setEventTime(Math.floor(eventData.eventTime / 1000))
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl(eventData.eventSourceUrl)
        .setActionSource(eventData.actionSource);

      const eventsData = [serverEvent];
      const eventRequest = new EventRequest(this.accessToken, this.pixelId)
        .setEvents(eventsData);

      const response = await eventRequest.execute();
      console.log('Facebook event tracked:', response);
    } catch (error) {
      console.error('Facebook Conversions API error:', error);
    }
  }
}

export const facebookAPI = new FacebookConversionsAPI();