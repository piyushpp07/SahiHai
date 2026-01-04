# MongoDB Connection Issues - Troubleshooting Guide

## Problem

If you're seeing this error in your Vercel logs:

```
MongoNetworkTimeoutError: Socket 'secureConnect' timed out after 30779ms
```

This means your serverless function cannot connect to MongoDB within the timeout period.

## Solutions

### 1. **Check MongoDB Connection String**

Make sure your `MONGO_URI` environment variable is set correctly in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/update `MONGO_URI` with your MongoDB connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/sahihai?retryWrites=true&w=majority&appName=SahiHai
   ```

### 2. **MongoDB Atlas Network Access**

MongoDB Atlas blocks connections by default. You need to whitelist Vercel's IP addresses:

1. Go to MongoDB Atlas dashboard
2. Click **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ For production, use specific Vercel IP ranges instead
5. Click **Confirm**

### 3. **Verify MongoDB Cluster Status**

1. Go to MongoDB Atlas dashboard
2. Check if your cluster is running (should show "Active")
3. If paused, click **Resume** to start it

### 4. **Update Environment Variables in Vercel**

Required environment variables:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sahihai?retryWrites=true&w=majority
GEMINI_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key (optional)
```

### 5. **Serverless-Friendly MongoDB Setup**

The codebase now includes optimized MongoDB connection handling for serverless:

- ✅ Connection caching across function invocations
- ✅ Reduced timeout (10s instead of 30s)
- ✅ Graceful degradation if database is unavailable
- ✅ Automatic retry logic

### 6. **If MongoDB is Optional**

If you don't need database features right now:

- Simply don't set `MONGO_URI` in Vercel
- The app will work without the database (history features disabled)
- You'll see warnings but no errors

### 7. **Recommended MongoDB Atlas Settings**

For Vercel deployment, use these MongoDB connection string parameters:

```
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&maxPoolSize=10&minPoolSize=1&maxIdleTimeMS=30000&connectTimeoutMS=10000&socketTimeoutMS=45000
```

Key parameters explained:

- `maxPoolSize=10`: Limit connections (good for serverless)
- `minPoolSize=1`: Keep at least one connection
- `connectTimeoutMS=10000`: 10s connection timeout
- `socketTimeoutMS=45000`: 45s socket timeout
- `retryWrites=true`: Automatically retry failed writes

### 8. **Debugging Steps**

1. **Check Vercel logs:**

   ```bash
   vercel logs <your-deployment-url>
   ```

2. **Test MongoDB connection locally:**

   ```bash
   cd server
   npm run dev
   ```

   - If it works locally but not on Vercel, it's a network/config issue

3. **Verify environment variables are set in Vercel:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Make sure `MONGO_URI` is visible and correct

## Quick Fix Checklist

- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] MongoDB cluster is Active (not Paused)
- [ ] `MONGO_URI` is set in Vercel environment variables
- [ ] Connection string includes `retryWrites=true&w=majority`
- [ ] Re-deploy after setting environment variables

## Still Having Issues?

If the database connection is not critical for your MVP:

1. Remove `MONGO_URI` from Vercel environment variables
2. The app will gracefully disable database features
3. Focus on getting the AI features working first
4. Add database later when needed

## Error Code Reference

- **MongoNetworkTimeoutError**: Cannot reach MongoDB server (usually network/firewall)
- **MongoServerSelectionTimeoutError**: Cannot find MongoDB server (wrong connection string)
- **Authentication failed**: Wrong username/password in connection string
