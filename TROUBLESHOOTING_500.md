# 🐛 Troubleshooting 500 Error on /api/scam/check

## Problem

`POST /api/scam/check` returns 500 when trying to analyze a scam screenshot.

## Possible Causes

### 1. ❌ Missing GEMINI_API_KEY on Vercel

**Symptom**: Error message: "API key not valid" or undefined key error

**Solution**:

```bash
# Set in Vercel dashboard
vercel env add GEMINI_API_KEY
# Paste your regenerated Gemini API key

# Then redeploy
vercel --prod
```

### 2. ❌ File Not Being Uploaded Correctly

**Symptom**: File path/buffer is undefined in controller

**Frontend Check**:

```javascript
// In app/(tabs)/scam.js
const formData = new FormData();
formData.append("file", {
  uri: photo.uri,
  name: "scam.jpg",
  type: "image/jpeg", // ← Must be image type
});
```

### 3. ❌ API Response Structure Changed

**Symptom**: Response doesn't parse as JSON

**Backend Check**: Controller tries to parse AI response as JSON. If Gemini returns plain text, it fails.

## Quick Test

### 1. Test with cURL (Linux/Mac)

```bash
# Create a test image file
curl -X POST https://sahi-hai-tau.vercel.app/api/scam/check \
  -F "file=@test-image.jpg"
```

### 2. Test Health Endpoint First

```bash
curl https://sahi-hai-tau.vercel.app/
# Should return: "SahiHai Server is running!"
```

### 3. Check Vercel Logs

```bash
vercel logs --prod
```

## Frontend Code Check

**File**: `/Users/piyushparadkar/Desktop/SahiHai/client/app/(tabs)/scam.js`

Current implementation should:

1. ✅ Capture screenshot
2. ✅ Create FormData
3. ✅ Append file with MIME type `image/jpeg` or `image/png`
4. ✅ POST to `/api/scam/check`
5. ✅ Handle response

## Backend Code Check

**File**: `/Users/piyushparadkar/Desktop/SahiHai/server/src/controllers/scamController.ts`

Checklist:

- [x] Check if file exists
- [x] Get MIME type
- [x] Convert file/buffer to base64
- [x] Call Gemini API
- [x] Parse JSON response
- [x] Clean up temp files
- [x] Return error if any step fails

## Environment Variables Needed

On Vercel dashboard, set:

```
GEMINI_API_KEY = your_regenerated_key
GROQ_API_KEY = your_regenerated_key
MONGO_URI = your_mongodb_connection_string
NODE_ENV = production
```

## If Still Getting 500

### Debug Steps:

1. Check Vercel deployment logs:

   ```bash
   vercel logs --prod --tail
   ```

2. Check if GEMINI_API_KEY is set:

   ```bash
   vercel env list
   ```

3. Redeploy with environment variables:

   ```bash
   cd server
   vercel --prod
   ```

4. Monitor real-time logs:
   ```bash
   vercel logs --prod --follow
   ```

## API Response Format

**Success (200)**:

```json
{
  "isScam": false,
  "riskLevel": "Low",
  "reason": "No suspicious indicators found"
}
```

**Error (400 - No file)**:

```json
{
  "error": "No file uploaded."
}
```

**Error (500 - Server error)**:

```json
{
  "error": "Failed to analyze screenshot.",
  "details": "error message here"
}
```

---

## Next Steps

1. **Verify API keys are set in Vercel** ← DO THIS FIRST
2. Redeploy the backend
3. Test with a real image file
4. Check Vercel logs for detailed error messages

See `DEPLOYMENT_SUCCESS.md` for full deployment details.
