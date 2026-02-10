# 🚀 Setup Guide - Personal Assistant App

## Quick Start (15 Minutes Total)

Your app is built and ready! Follow these steps to get it live on your iPad.

---

## Step 1: Gmail OAuth Setup (5 minutes)

### A. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "NEW PROJECT"
3. Name it: "Personal Assistant"
4. Click "CREATE"

### B. Enable Gmail API

1. In the search bar, type "Gmail API"
2. Click "Gmail API" → Click "ENABLE"

### C. Create OAuth Credentials

1. Click "Credentials" in the left sidebar
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, click "CONFIGURE CONSENT SCREEN":
   - Select "External" → Click "CREATE"
   - App name: "Personal Assistant"
   - User support email: Your email
   - Developer contact: Your email
   - Click "SAVE AND CONTINUE" (skip scopes)
   - Click "SAVE AND CONTINUE" (skip test users)
   - Click "BACK TO DASHBOARD"
4. Go back to "Credentials" → "+ CREATE CREDENTIALS" → "OAuth client ID"
5. Application type: "Web application"
6. Name: "Personal Assistant Web"
7. Authorized redirect URIs → Click "+ ADD URI":
   - Add: `http://localhost:3000/api/auth/callback/google`
   - Add: `https://your-app.vercel.app/api/auth/callback/google` (we'll update this after deployment)
8. Click "CREATE"
9. **COPY** the Client ID and Client Secret (you'll need these!)

---

## Step 2: Outlook OAuth Setup (5 minutes)

### A. Go to Azure Portal

1. Visit [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account (aathomlinson@outlook.com)

### B. Register App

1. Search for "App registrations" in the top search bar
2. Click "+ New registration"
3. Name: "Personal Assistant"
4. Supported account types: Select "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI:
   - Platform: "Web"
   - URI: `http://localhost:3000/api/auth/callback/microsoft`
6. Click "Register"

### C. Get Credentials

1. On the Overview page, **COPY** the "Application (client) ID"
2. Click "Certificates & secrets" in the left sidebar
3. Click "+ New client secret"
4. Description: "Personal Assistant Secret"
5. Expires: "24 months"
6. Click "Add"
7. **IMMEDIATELY COPY** the secret Value (it won't show again!)

### D. Set Permissions

1. Click "API permissions" in the left sidebar
2. Click "+ Add a permission"
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Search and add these permissions:
   - `Mail.Read`
   - `Mail.ReadWrite`
   - `Mail.Send`
   - `offline_access`
   - `User.Read`
6. Click "Add permissions"

---

## Step 3: Add Credentials to Your App (2 minutes)

### Create `.env.local` File

1. In your project folder, create a file named `.env.local`
2. Copy this template and fill in your values:

```bash
# Gmail OAuth
GOOGLE_CLIENT_ID=paste_your_google_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_google_client_secret_here

# Outlook OAuth  
MICROSOFT_CLIENT_ID=paste_your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=paste_your_microsoft_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_this_with_command_below

# TfNSW Transport
TFNSW_API_TOKEN=your_tfnsw_api_token_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

### Generate NEXTAUTH_SECRET

Run this command in terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the `NEXTAUTH_SECRET` value.

### Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## Step 4: Deploy to Vercel (3 minutes)

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login to Vercel

```bash
vercel login
```

This will open your browser - click "Continue with GitHub" or "Continue with Email"

### C. Deploy

```bash
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? **personal-assistant** (or press Enter)
- Directory? **./** (press Enter)
- Override settings? **N**

Vercel will deploy and give you a URL like: `https://personal-assistant-xyz.vercel.app`

### D. Add Environment Variables to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your "personal-assistant" project
3. Click "Settings" → "Environment Variables"
4. Add each variable from your `.env.local` file:
   - Name: `GOOGLE_CLIENT_ID`, Value: (paste your value)
   - Name: `GOOGLE_CLIENT_SECRET`, Value: (paste your value)
   - Name: `MICROSOFT_CLIENT_ID`, Value: (paste your value)
   - Name: `MICROSOFT_CLIENT_SECRET`, Value: (paste your value)
   - Name: `NEXTAUTH_SECRET`, Value: (paste your value)
   - Name: `TFNSW_API_TOKEN`, Value: (already there)
   - Name: `OPENAI_API_KEY`, Value: (already there)
5. Click "Save" for each

### E. Update OAuth Redirect URIs

1. **Google Cloud Console**:
   - Go back to your OAuth credentials
   - Add redirect URI: `https://your-actual-url.vercel.app/api/auth/callback/google`
   - Click "SAVE"

2. **Azure Portal**:
   - Go back to your app registration
   - Click "Authentication"
   - Add redirect URI: `https://your-actual-url.vercel.app/api/auth/callback/microsoft`
   - Click "Save"

### F. Redeploy

```bash
vercel --prod
```

---

## Step 5: Install on iPad (1 minute)

### A. Open on iPad

1. Open Safari on your iPad
2. Go to your Vercel URL: `https://your-app.vercel.app`

### B. Add to Home Screen

1. Tap the **Share** button (square with arrow pointing up)
2. Scroll down and tap **"Add to Home Screen"**
3. Name it: "My Assistant"
4. Tap **"Add"**

### C. Open the App

1. Find the app icon on your home screen
2. Tap to open
3. It will run like a native app! 🎉

---

## Step 6: First Time Setup (2 minutes)

### A. Connect Gmail

1. Open the app
2. Go to the Inbox section
3. Tap "Connect Gmail"
4. Sign in with your Google account
5. Grant permissions

### B. Connect Outlook

1. In the Inbox section
2. Tap "Connect Outlook"
3. Sign in with aathomlinson@outlook.com
4. Grant permissions

### C. Update Debt Balances

1. Go to Debt Tracker
2. Tap "Update Balances"
3. Enter current balances:
   - Westpac: $5,500
   - St George: $7,000
4. Tap "Save"

---

## ✅ You're Done!

Your personal assistant is now:
- ✅ Live on the internet
- ✅ Installed on your iPad
- ✅ Syncing emails from Gmail + Outlook
- ✅ Tracking your debt
- ✅ Showing live Sydney Trains
- ✅ Providing AI insights

---

## Daily Usage

### Morning Routine (2 minutes)
1. Open app
2. Check Debt Tracker progress
3. Review AI email suggestions
4. Tap actions (Reply/Delete/File)
5. Check train times if commuting

### Throughout the Day
- App syncs emails automatically
- Get spending alerts if you add transactions
- Check train times as needed

### Evening (1 minute)
- Review any remaining emails
- Update debt balance if you made a payment
- Check progress to Inbox Zero

---

## Troubleshooting

**Emails not syncing?**
- Check internet connection
- Re-authenticate (tap "Reconnect" in settings)

**App not updating?**
- Pull down to refresh
- Close and reopen app

**Can't install on iPad?**
- Make sure you're using Safari (not Chrome)
- Check you're on the HTTPS Vercel URL

---

## Support

If you get stuck:
1. Check the error message
2. Try refreshing the page
3. Check environment variables in Vercel
4. Restart the app

**Most common issue**: Forgot to add environment variables to Vercel!

---

## Next Steps

Once everything is working:
1. Customize spending categories
2. Set up email auto-rules
3. Add favorite train stations
4. Set debt payoff goals
5. Explore AI insights

**Enjoy your new personal assistant!** 🚀
