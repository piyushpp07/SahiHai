# 🚀 SahiHai Quick Reference

## ✅ Status: COMPLETE & WORKING

**Backend URL**: https://sahi-hai-tau.vercel.app  
**Repository**: github.com/piyushpp07/SahiHai

---

## 📋 Quick Commands

### Run Frontend

```bash
cd client
npx expo start -c
```

### Run Backend Locally

```bash
cd server
npm run dev
```

### Deploy Backend to Vercel

```bash
cd server
npm run build
vercel --prod
```

### Update Vercel Environment Variables

```bash
vercel env add GEMINI_API_KEY
vercel env add GROQ_API_KEY
vercel env add MONGO_URI
vercel --prod  # Redeploy
```

### Test API Endpoints

```bash
# Health check
curl https://sahi-hai-tau.vercel.app/

# Get recent scans
curl https://sahi-hai-tau.vercel.app/api/scans

# Upload screenshot for scam check
curl -X POST https://sahi-hai-tau.vercel.app/api/scam/check \
  -F "file=@screenshot.jpg"
```

---

## 📚 Documentation Guide

| Need                     | File                     | Location |
| ------------------------ | ------------------------ | -------- |
| API endpoints & examples | `API_DOCS.md`            | Root     |
| Deployment steps         | `DEPLOYMENT_SUCCESS.md`  | Root     |
| Fix 500 errors           | `TROUBLESHOOTING_500.md` | Root     |
| Security setup           | `CRITICAL_SECURITY.md`   | Root     |
| What's done              | `PROJECT_COMPLETE.md`    | Root     |

---

## 🔧 Common Issues & Fixes

| Problem                        | Solution                                            |
| ------------------------------ | --------------------------------------------------- |
| 500 error on `/api/scam/check` | Check MongoDB whitelist & API keys in Vercel        |
| Frontend can't reach backend   | Verify `EXPO_PUBLIC_API_URL` in `client/.env.local` |
| Build fails locally            | Run `npm install` in both client & server           |
| MongoDB timeout                | Whitelist Vercel IPs in MongoDB Atlas               |

---

## 🎯 File Structure

```
client/               # Frontend (Expo/React Native)
├── app/
│   ├── (tabs)/      # Main screens
│   ├── utils/       # API client ✅
│   └── ...
├── .env.local       # ✅ Has Vercel URL
└── package.json

server/              # Backend (Express/TypeScript)
├── src/
│   ├── index.ts     # ✅ Main server
│   ├── controllers/ # ✅ API handlers
│   └── models/      # ✅ DB models
├── dist/            # ✅ Compiled JS
├── vercel.json      # ✅ Deploy config
└── package.json     # ✅ Updated

Docs/
├── API_DOCS.md
├── PROJECT_COMPLETE.md
├── CRITICAL_SECURITY.md
└── ... (6 more guides)
```

---

## ✅ Checklist

- [x] Backend deployed on Vercel
- [x] Frontend configured for Vercel URL
- [x] API keys regenerated & secured
- [x] MongoDB whitelisted for Vercel
- [x] All endpoint mismatches fixed
- [x] Documentation complete
- [x] Security verified

---

## 🚀 You're Ready to:

1. ✅ Test the frontend app
2. ✅ Deploy updates to Vercel
3. ✅ Add new features
4. ✅ Scale the application

**Everything is documented and ready!**

---

Last Updated: Jan 4, 2026 | Status: ✅ PRODUCTION READY
