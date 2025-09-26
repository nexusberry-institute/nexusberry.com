// Enhanced GTM Integration (optional)
// lib/marketing/gtm-server-side.ts

export class GTMServerSide {
  static async sendToGTM(eventData: any) {
    // If you want to also send events to GTM's server-side container
    const serverContainerUrl = process.env.GTM_SERVER_CONTAINER_URL;

    if (serverContainerUrl) {
      try {
        await fetch(`${serverContainerUrl}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
      } catch (error) {
        console.error('GTM Server-side tracking error:', error);
      }
    }
  }
}