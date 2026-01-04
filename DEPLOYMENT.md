# SahiHai Backend Deployment Guide

## Deploying to Vercel

### Prerequisites

- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- Environment variables ready

### Step 1: Prepare Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
PORT=5051
NODE_ENV=production
MONGO_URI="your_mongodb_connection_string"
GEMINI_API_KEY="your_gemini_key"
GROQ_API_KEY="your_groq_key"
```

### Step 2: Push to Git

```bash
git add .
git commit -m "Prepare backend for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel

#### Option A: Via Vercel CLI (Recommended)

```bash
npm install -g vercel
cd /path/to/server
vercel
```

When prompted:

- Select your project
- Set `NODE_ENV=production`
- Add environment variables from `.env.local`

#### Option B: Via Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Set build command: `npm run build`
5. Set start command: `node dist/index.js`
6. Add environment variables
7. Deploy

### Step 4: Configure Environment Variables in Vercel

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
MONGO_URI: mongodb+srv://...
GEMINI_API_KEY: your_key
GROQ_API_KEY: your_key
NODE_ENV: production
```

### Step 5: Update Frontend API Base URL

After deployment, Vercel will provide a URL like `https://sahihai-backend.vercel.app`

Update your frontend `app/utils/api.js`:

```javascript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.34:5051";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
```

Add to your frontend `.env`:

```
EXPO_PUBLIC_API_URL=https://sahihai-backend.vercel.app
```

### API Endpoints

All endpoints are available at your Vercel URL:

- `GET /` - Health check
- `POST /api/analyze` - Analyze bill images/audio
- `POST /api/scam/check` - Check for scam indicators
- `POST /api/sarkari/draft` - Draft complaint letters
- `POST /api/chat/consult` - Chat consultation
- `GET /api/scans` - Get recent scans
- `GET /api/scans/history` - Scan history
- `GET /api/scans/stats` - Scan statistics

### Troubleshooting

**Issue: File upload not working**

- Vercel uses in-memory storage (for free tier)
- Large files (>5MB) will fail
- For persistent storage, migrate to Cloudinary or AWS S3

**Issue: MongoDB connection error**

- Ensure MongoDB connection string is correct
- Add Vercel IP to MongoDB Atlas whitelist (allow all or `0.0.0.0/0`)

**Issue: Timeout errors**

- Increase timeout in frontend API client
- Use Vercel Pro for more computational resources
- Consider using background jobs for heavy processing

### Monitoring

Visit Vercel dashboard to monitor:

- Build logs
- Function logs
- Performance metrics
- Error tracking

### Cost Considerations

- **Free Tier**: 100 GB bandwidth/month, up to 100 serverless functions
- **Pro**: $20/month for more bandwidth and compute time
- **MongoDB Atlas**: Free tier 512MB, pay-as-you-go for more

---

For issues or questions, refer to:

- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Groq API Docs](https://console.groq.com/docs)
