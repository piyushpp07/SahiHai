# 🔒 Security Guide - SahiHai

## ⚠️ CRITICAL: Exposed Credentials

Your `.env` file containing API keys and MongoDB credentials was exposed. **You must immediately:**

### 1. Regenerate All Credentials

#### Google Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
- Delete the exposed key
- Create a new API key
- Update `GEMINI_API_KEY` in Vercel

#### Groq API Key
- Go to [Groq Console](https://console.groq.com/keys)
- Delete the exposed key
- Create a new API key
- Update `GROQ_API_KEY` in Vercel

#### MongoDB Password
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Navigate to Database Access
- Delete the exposed user password
- Create a new password
- Update `MONGO_URI` in Vercel

### 2. Update Vercel Environment Variables

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add GROQ_API_KEY
vercel env add MONGO_URI
vercel env add NODE_ENV

# Redeploy
vercel --prod
```

Or use the Vercel Dashboard:
1. Go to your project settings
2. Select "Environment Variables"
3. Add all variables (see `.env.example`)
4. Redeploy

### 3. Local Development Best Practices

**Never commit `.env` file:**
```bash
# .gitignore already has this, but verify:
cat .gitignore | grep "^.env"
```

**Always use `.env.local`:**
```bash
# Copy the example
cp server/.env.example server/.env.local

# Add your local credentials here
# This file is in .gitignore and won't be committed
```

**Verify `.env` is in `.gitignore`:**
```
server/.env          ✅ Ignored
server/.env.local    ✅ Ignored
server/.env.*.local  ✅ Ignored
```

### 4. Check Git History for Leaks

```bash
# Check if .env was ever committed
git log --all --full-history -- "server/.env"

# Remove from history if committed (use BFG or git-filter-branch)
# Usually not needed if file wasn't committed
```

### 5. Enable Git Hooks (Optional but Recommended)

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Prevent accidental .env commits

if git diff --cached --name-only | grep -q "\.env$"; then
  echo "❌ ERROR: Cannot commit .env file!"
  echo "Use .env.local for local development (it's in .gitignore)"
  exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 6. Environment Variables Configuration

**For Local Development:**
```
server/.env.local (git ignored)
client/.env.local (git ignored)
```

**For Vercel Deployment:**
```
Set in Vercel Dashboard → Settings → Environment Variables
```

**Variables Needed:**

```env
# Server
PORT=5051
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sahihai?retryWrites=true&w=majority

# API Keys (regenerate new ones)
GEMINI_API_KEY=AIzaSy... (NEW KEY - regenerate)
GROQ_API_KEY=gsk_... (NEW KEY - regenerate)

# Client
EXPO_PUBLIC_API_URL=https://your-vercel-deployment.vercel.app
```

### 7. Monitoring & Alerts

Enable GitHub secret scanning:
1. Go to your repository
2. Settings → Security & analysis
3. Enable "Secret scanning"
4. Enable "Push protection"

### 8. Checklist

- [ ] Regenerated Google Gemini API Key
- [ ] Regenerated Groq API Key
- [ ] Changed MongoDB password
- [ ] Updated Vercel environment variables
- [ ] Verified `.env` is in `.gitignore`
- [ ] Created `.env.local` for local development
- [ ] Tested deployment with new credentials
- [ ] Enabled GitHub secret scanning

### 9. Testing New Credentials

```bash
# Local testing
cd server
npm install -g nodemon
npm run dev

# Test endpoints
curl http://localhost:5051/

# Vercel testing
curl https://your-vercel-deployment.vercel.app/
```

---

## Additional Security Measures

### API Key Rotation Schedule
- 🔄 Rotate keys every 90 days in production
- 🔄 Rotate immediately if exposed

### Rate Limiting
Consider adding rate limiting to prevent abuse:
```javascript
// In server/src/index.ts
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### CORS Configuration
Verify CORS is properly configured in `server/src/index.ts`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.1.34:8081',
    'https://your-domain.com'
  ],
  credentials: true
}));
```

### MongoDB Security
- ✅ Use strong passwords (20+ characters)
- ✅ Enable IP whitelist in MongoDB Atlas
- ✅ Use read-only user for non-admin operations
- ✅ Enable audit logs

---

**Remember: Never share credentials in chat, emails, or public repositories!**

For questions or security concerns, contact your security team.

Last Updated: January 4, 2026
