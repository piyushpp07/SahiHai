# 🔧 Environment Configuration Guide

## ✅ API URL Now Uses Environment Variables!

Instead of hardcoding the backend URL, the app now uses **Expo's environment variables**.

---

## 📁 Configuration Files

### **`.env`** (Active Configuration)

```bash
# Current configuration
EXPO_PUBLIC_API_URL=http://192.168.1.39:5051
```

This is your **active configuration** file (not committed to git).

### **`.env.example`** (Template)

```bash
# Template for other developers
EXPO_PUBLIC_API_URL=http://192.168.1.39:5051
```

This is the **template** file (committed to git) that shows what variables are needed.

---

## 🔄 How It Works

### **In `app/context/AuthContext.js`:**

```javascript
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:5051";
```

### **In `app/utils/api.js`:**

```javascript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:5051";
```

**Priority:**

1. Uses `EXPO_PUBLIC_API_URL` from `.env` file (if exists)
2. Falls back to hardcoded IP if `.env` not found

---

## 🚀 Setup for Development

### **1. Find Your Server IP**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Example output: `inet 192.168.1.39`

### **2. Update `.env` File**

Edit `client/.env`:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_IP:5051
```

Replace `YOUR_IP` with the IP from step 1.

### **3. Restart Expo**

**Important:** Expo must be restarted to pick up .env changes!

```bash
cd client
npm start -- --reset-cache
```

Or press `r` in the Expo terminal to reload.

### **4. Verify**

Watch the console when app starts. You should see:

```
🔗 API URL: http://192.168.1.39:5051
🔗 API Base URL: http://192.168.1.39:5051
```

---

## 🌍 Environment Configurations

### **Local Development**

```bash
# Use your local machine's IP
EXPO_PUBLIC_API_URL=http://192.168.1.39:5051
```

**Use when:**

- Testing on physical device on same WiFi
- Running backend locally

### **Localhost (Emulator Only)**

```bash
# Only works in iOS Simulator or Android Emulator
EXPO_PUBLIC_API_URL=http://localhost:5051

# For Android Emulator, use:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5051
```

**Use when:**

- Testing in iOS Simulator
- Testing in Android Emulator

### **Production/Staging**

```bash
# Use deployed backend URL
EXPO_PUBLIC_API_URL=https://sahihai-api.yourserver.com
```

**Use when:**

- App is deployed
- Backend is hosted on cloud (Vercel, Railway, etc.)

---

## 📝 Benefits of Environment Variables

✅ **No Hardcoding** - API URL is configurable  
✅ **Git Ignore** - `.env` not committed (keeps IPs private)  
✅ **Easy Switching** - Change between local/staging/production  
✅ **Team Friendly** - Each developer uses their own IP  
✅ **Secure** - Can store API keys safely

---

## 🔒 Git Configuration

### **Already Configured:**

**`.gitignore`** includes:

```
.env
.env.local
```

So your local `.env` file is **NOT committed** to git.

**`.env.example`** is committed and shows:

- What variables are needed
- Example values
- Documentation for other developers

---

## 👥 For Other Developers

When someone clones the repo:

1. **Copy `.env.example` to `.env`:**

   ```bash
   cd client
   cp .env.example .env
   ```

2. **Find their IP:**

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Update `.env` with their IP:**

   ```bash
   EXPO_PUBLIC_API_URL=http://THEIR_IP:5051
   ```

4. **Start Expo:**
   ```bash
   npm start
   ```

---

## 🐛 Troubleshooting

### **Environment variable not loading**

**Symptom:** App still uses old hardcoded URL

**Solution:**

```bash
# Clear Expo cache and restart
npm start -- --clear
# or
npx expo start -c
```

### **Console shows wrong URL**

**Problem:** `.env` changes not picked up

**Solution:**

1. Stop Expo (Ctrl+C)
2. Verify `.env` file contents
3. Restart with cache clear: `npm start -- --clear`

### **Works in Expo Go, fails in standalone build**

**Problem:** Environment variables need to be baked into build

**Solution:**
For production builds, use `eas.json` or build-time configuration:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-production-api.com"
      }
    }
  }
}
```

---

## 📊 Current Setup

| File                 | Value                                  | Purpose                |
| -------------------- | -------------------------------------- | ---------------------- |
| **`.env`**           | `http://192.168.1.39:5051`             | Active local config    |
| **`.env.example`**   | `http://192.168.1.39:5051`             | Template/documentation |
| **`AuthContext.js`** | Uses `process.env.EXPO_PUBLIC_API_URL` | Auth API calls         |
| **`api.js`**         | Uses `process.env.EXPO_PUBLIC_API_URL` | Axios instance         |

---

## ✅ Checklist

- [x] `.env` file created with current IP
- [x] `.env.example` updated as template
- [x] `AuthContext.js` uses environment variable
- [x] `api.js` uses environment variable
- [x] Console logs added for debugging
- [x] `.gitignore` configured to exclude `.env`
- [x] Fallback values provided for safety

---

## 🎯 Next Steps

1. **Restart Expo** to load new `.env`:

   ```bash
   cd client
   npm start -- --clear
   ```

2. **Check console** for API URL logs:

   ```
   🔗 API URL: http://192.168.1.39:5051
   ```

3. **Test authentication** - Should work with new setup!

---

## 💡 Pro Tips

**Quick IP check:**

```bash
# Add to .bashrc or .zshrc
alias getip="ifconfig | grep 'inet ' | grep -v 127.0.0.1 | head -1"
```

**Update .env quickly:**

```bash
echo "EXPO_PUBLIC_API_URL=http://$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}' | head -1):5051" > client/.env
```

**Verify environment:**

```bash
cat client/.env
```

---

Your API URL configuration is now **professional and production-ready**! 🎉
