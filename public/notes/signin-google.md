# PayloadCMS + Next.js + Google OAuth Setup Guide

## Step 1: Google Cloud Platform Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click project dropdown → **"New Project"**
3. Enter name (e.g., "My App OAuth") → Click **"Create"**

### 1.2 Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in:
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Add `email`, `profile`, `openid`
6. **Test users**: Add your email for testing
7. Click **"Save and Continue"**

### 1.3 Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
5. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
6. Click **"Create"** → Copy **Client ID** and **Client Secret**

---

## Step 2: PayloadCMS Users Collection

Add these fields to your Users collection:

\`\`\`typescript
// collections/Users.ts
const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'image', type: 'text' },
    { name: 'googleId', type: 'text', unique: true },
    { name: 'emailVerified', type: 'checkbox', defaultValue: false },
    { name: 'locale', type: 'text' },
    { name: 'givenName', type: 'text' },
    { name: 'familyName', type: 'text' },
  ],
}
\`\`\`

---

## Step 3: Environment Variables

Add these to the **Vars** section in the v0 sidebar:

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Generate with `npx auth secret` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `PAYLOAD_API_URL` | Your PayloadCMS URL (e.g., `https://your-payload.com`) |
| `PAYLOAD_API_KEY` | PayloadCMS API key with user permissions |

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Check redirect URIs in Google Cloud Console |
| `access_denied` | Add user to test users or publish app |
| `OAuthAccountNotLinked` | Email already exists with different provider |
| `Configuration` | Check environment variables are set |
