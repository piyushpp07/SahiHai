# 🚀 SahiHai Backend - Vercel Redeploy Guide

## Quick Start (Fix Current Deployment)

Your deployment at `https://sahi-hai-tau.vercel.app` is not routing correctly. Let's fix it!

### Step 1: Regenerate Credentials (⚠️ IMPORTANT)

Since you exposed your `.env` file, you **must** regenerate all keys:

#### 1.1 Google Gemini API Key
```bash
# Go to: https://aistudio.google.com/app/apikeys
# 1. Delete your current key (YAIzaSyCW1YR9Enm...)
# 2. Create new key
# 3. Copy the new key
```

#### 1.2 Groq API Key
```bash
# Go to: https://console.groq.com/keys
# 1. Delete current key (gsk_j7YTL8oWzI3Y...)
# 2. Create new key
# 3. Copy the new key
```

#### 1.3 MongoDB Password
```bash
# Go to: https://cloud.mongodb.com/
# 1. Database Access → piyush user
# 2. Edit → Change Password
# 3. Copy new password
# 4. Update MONGO_URI: mongodb+srv://piyush:NEW_PASSWORD@hhld-chat-app.ciiv9qe.mongodb.net/...
```

### Step 2: Update Local .env

```bash
# Create local .env.local (will be ignored by git)
cd /Users/piyushparadkar/Desktop/SahiHai/server
cat > .env.local << EOF
PORT=5051
NODE_ENV=development
MONGO_URI="mongodb+srv://piyush:NEW_PASSWORD@hhld-chat-app.ciiv9qe.mongodb.net/text-to-learn?retryWrites=true&w=majority"
GEMINI_API_KEY="NEW_GEMINI_KEY_HERE"
GROQ_API_KEY="NEW_GROQ_KEY_HERE"
EOF
```

### Step 3: Rebuild and Test Locally

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/server

# Clean build
rm -rf dist node_modules
npm install
npm run build

# Test locally
npm run dev
```

Then test:
```bash
curl http://localhost:5051/
```

### Step 4: Commit Updated vercel.json

```bash
cd /Users/piyushparadkar/Desktop/SahiHai
git add server/vercel.json
git commit -m "fix: update vercel.json for proper Node.js deployment"
git push origin main
```

### Step 5: Update Vercel Environment Variables

**Option A: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to server directory
cd /Users/piyushparadkar/Desktop/SahiHai/server

# Login (if not already)
vercel login

# Set environment variables
vercel env add MONGO_URI
# Paste: mongodb+srv://piyush:NEW_PASSWORD@hhld-chat-app.ciiv9qe.mongodb.net/text-to-learn?retryWrites=true&w=majority

vercel env add GEMINI_API_KEY
# Paste: NEW_GEMINI_KEY_HERE

vercel env add GROQ_API_KEY
# Paste: NEW_GROQ_KEY_HERE

vercel env add NODE_ENV
# Paste: production

# Link to existing project (if not already linked)
vercel link --confirm

# Redeploy
vercel --prod
```

**Option B: Via Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `sahi-hai-tau`
3. Go to **Settings** → **Environment Variables**
4. Delete old variables and add new ones:
   - `MONGO_URI` = `mongodb+srv://piyush:NEW_PASSWORD@...`
   - `GEMINI_API_KEY` = `NEW_KEY`
   - `GROQ_API_KEY` = `NEW_KEY`
   - `NODE_ENV` = `production`
5. Click **Deployments** → **Redeploy** latest commit

### Step 6: Test Deployed Backend

```bash
# Health check
curl https://sahi-hai-tau.vercel.app/

# Get recent scans
curl https://sahi-hai-tau.vercel.app/api/scans

# Expected response:
# {"scans": [], "totalSaved": 0}
```

### Step 7: Update Frontend API URL

Once deployment is confirmed working, update frontend:

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client

# Create .env.local
cat > .env.local << EOF
EXPO_PUBLIC_API_URL=https://sahi-hai-tau.vercel.app
EOF
```

### Step 8: Test Frontend

```bash
# Restart Expo
cd /Users/piyushparadkar/Desktop/SahiHai/client
npx expo start -c
```

---

## Verification Checklist

- [ ] Generated new Gemini API key
- [ ] Generated new Groq API key
- [ ] Changed MongoDB password
- [ ] Updated local `.env.local` with new credentials
- [ ] Built and tested locally (`npm run build` + `npm run dev`)
- [ ] Committed `vercel.json` changes
- [ ] Updated Vercel environment variables
- [ ] Redeployed to Vercel
- [ ] Tested health endpoint: `curl https://sahi-hai-tau.vercel.app/`
- [ ] Tested API endpoint: `curl https://sahi-hai-tau.vercel.app/api/scans`
- [ ] Updated client `.env.local` with Vercel URL
- [ ] Tested frontend with new API URL

---

## Expected Responses

### Health Check
```bash
$ curl https://sahi-hai-tau.vercel.app/
SahiHai Server is running!
```

### Get Scans
```bash
$ curl https://sahi-hai-tau.vercel.app/api/scans
{"scans":[],"totalSaved":0}
```

### Scan History (with device ID)
```bash
$ curl -H "x-device-id: test-device" https://sahi-hai-tau.vercel.app/api/scans/history
[]
```

---

## Debugging

### Check Vercel Build Logs
```bash
# Via CLI
vercel logs --prod

# Or in Dashboard:
# Project → Deployments → Click latest → Logs
```

### Check Function Logs
```bash
vercel logs --prod --follow
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` locally, verify build works |
| `404 on all routes` | Check `vercel.json` routing configuration |
| `MongoDB connection error` | Verify MONGO_URI in Vercel env, whitelist IP in Atlas |
| `API key errors` | Regenerate keys, update in Vercel dashboard |
| `Timeout errors` | Increase `maxDuration` in `vercel.json` |

---

## What Changed in vercel.json

```diff
{
    "version": 2,
+   "buildCommand": "npm run build",
+   "outputDirectory": "dist",
    "builds": [
-       {"src": "dist/index.js", "use": "@vercel/node"}
+       {"src": "package.json", "use": "@vercel/node@3.0.0"}
    ],
    "routes": [
        {"src": "/(.*)", "dest": "dist/index.js"}
    ],
+   "functions": {
+       "dist/index.js": {"maxDuration": 60}
+   }
}
```

**Why these changes?**
- `buildCommand`: Explicit build step
- `outputDirectory`: Tells Vercel where compiled code is
- `@vercel/node@3.0.0`: Latest runtime
- `maxDuration`: Allows longer-running requests (up to 60s)

---

## Next Steps After Successful Deployment

1. ✅ Test all endpoints with Postman or cURL
2. ✅ Deploy frontend with new API URL
3. ✅ Do user acceptance testing
4. ✅ Set up error monitoring (Sentry, Datadog, etc.)
5. ✅ Configure proper logging
6. ✅ Set up automated backups for MongoDB

---

**Last Updated**: January 4, 2026  
**Project**: SahiHai Backend  
**Deployment**: Vercel (sahi-hai-tau)
