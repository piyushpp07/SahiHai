# 🔒 CRITICAL: Regenerate Exposed API Keys

## ⚠️ Your Credentials Were Exposed
Your `.env` file was shared in this chat. The following types of credentials were exposed:
- **GEMINI_API_KEY**: (Exposed - Must regenerate)
- **GROQ_API_KEY**: (Exposed - Must regenerate)
- **MongoDB**: Password in `MONGO_URI` (Exposed - Must regenerate)

**These credentials must be regenerated IMMEDIATELY.**

---

## ✅ Regeneration Checklist

### Step 1: Generate New Gemini API Key
```
Status: [ ] NOT DONE
```

1. Go to https://aistudio.google.com/app/apikeys
2. Delete the exposed key (starting with `YAIzaSy...`)
3. Click "Create new API key"
4. Copy the new key

### Step 2: Generate New Groq API Key
```
Status: [ ] NOT DONE
```

1. Go to https://console.groq.com/keys
2. Delete the exposed key (starting with `gsk_...`)
3. Click "Create new API Key"
4. Copy the new key

### Step 3: Change MongoDB Password
```
Status: [ ] NOT DONE
```

1. Go to https://cloud.mongodb.com
2. Navigate to Database Access
3. Find user "piyush"
4. Click "Edit"
5. "Edit Password"
6. Generate a new password
7. Copy the new password

### Step 4: Update Vercel Environment Variables
```
Status: [ ] NOT DONE
```

Option A - Via Vercel CLI:
```bash
vercel env add GEMINI_API_KEY
# Paste: [NEW GEMINI KEY]

vercel env add GROQ_API_KEY
# Paste: [NEW GROQ KEY]

vercel env add MONGO_URI
# Paste: mongodb+srv://piyush:[NEW_PASSWORD]@hhld-chat-app.ciiv9qe.mongodb.net/text-to-learn?retryWrites=true&w=majority

# Redeploy
vercel --prod
```

Option B - Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Delete old variables
5. Add new ones
6. Go to Deployments
7. Click latest deployment
8. Click "Redeploy"

### Step 5: Update Local .env Files
```
Status: [ ] NOT DONE
```

```bash
# server/.env.local (if it exists)
GEMINI_API_KEY=new_key_here
GROQ_API_KEY=new_key_here
MONGO_URI=mongodb+srv://piyush:new_password@...

# client/.env.local (already updated with Vercel URL)
EXPO_PUBLIC_API_URL=https://sahi-hai-tau.vercel.app
```

### Step 6: Test Deployment
```
Status: [ ] NOT DONE
```

```bash
# Test health endpoint
curl https://sahi-hai-tau.vercel.app/

# Test with real data (after updating keys)
curl -X POST https://sahi-hai-tau.vercel.app/api/scam/check \
  -F "file=@screenshot.jpg"
```

---

## Why This Matters

⚠️ **Anyone with these credentials can**:
- Use your Gemini API and get billed
- Use your Groq API and get billed
- Access your entire MongoDB database
- Delete or modify all your data
- Impersonate your backend

---

## Timeline

- **Now**: Regenerate ALL credentials
- **Immediately after**: Update Vercel environment variables
- **Then**: Test deployment
- **Finally**: Test frontend with new backend

---

## Verification

After completing all steps:

✅ New GEMINI_API_KEY is set in Vercel  
✅ New GROQ_API_KEY is set in Vercel  
✅ New MongoDB password is in Vercel  
✅ Backend has been redeployed  
✅ `/api/scam/check` returns 200 (not 500)  
✅ Frontend successfully calls backend endpoints  

---

## Questions?

If you see errors after regeneration:
1. Check Vercel logs: `vercel logs --prod`
2. Verify environment variables: `vercel env list`
3. Confirm new credentials are correct
4. Check MongoDB IP whitelist includes Vercel IPs

**This is CRITICAL for security. Please complete ASAP.** 🔐

---

**Last Updated**: January 4, 2026  
**Status**: BLOCKING ISSUE - MUST FIX
