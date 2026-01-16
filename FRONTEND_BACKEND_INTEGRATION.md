# 🔗 Frontend-Backend Integration Guide

## Quick Steps to Connect Auth

### 1. **Find Your Server IP Address**

The server terminal already showed your IP. If you need it again:

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/server
ifconfig | grep "inet " | grep -v 127.0.0.1
```

You should see something like: `inet 192.168.1.100`

### 2. **Update Frontend AuthContext**

Edit: `client/app/context/AuthContext.js`

Add this at the top (line 4, after imports):

```javascript
// Replace with your actual server IP from step 1
const API_URL = "http://192.168.1.100:3000";
```

Then replace the entire `checkAuth`, `login`, and `signup` functions with the code from `AUTH_BACKEND_GUIDE.md` (lines 209-329).

### 3. **Start the Backend Server**

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/server
npm run dev
```

You should see:

```
✅ MongoDB Connected
🚀 Server running on port 3000
```

### 4. **Start the Mobile App**

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client
npm start
```

### 5. **Test Authentication Flow**

1. **Signup** - Create new account

   - Should send request to `http://YOUR_IP:3000/api/auth/signup`
   - Should receive JWT token
   - Should navigate to home

2. **Logout** - Tap logout in drawer

   - Should return to login screen
   - Token removed from storage

3. **Login** - Enter credentials

   - Should send request to `http://YOUR_IP:3000/api/auth/login`
   - Should receive JWT token
   - Should navigate to home

4. **Session Persistence** - Close and reopen app
   - Should check token with `http://YOUR_IP:3000/api/auth/me`
   - Should automatically login if token valid
   - Should show login screen if token invalid/expired

---

## Complete AuthContext.js Code

Replace lines 34-85 in `client/app/context/AuthContext.js`:

\`\`\`javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

// ⚠️ REPLACE THIS WITH YOUR SERVER IP
const API_URL = 'http://192.168.1.100:3000';

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Check if user is authenticated on app load
useEffect(() => {
checkAuth();
}, []);

const checkAuth = async () => {
try {
setLoading(true);
const token = await AsyncStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }

};

const login = async (email, password) => {
try {
setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }

};

const signup = async (name, email, password) => {
try {
setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }

};

const logout = async () => {
try {
await AsyncStorage.removeItem('token');
await AsyncStorage.removeItem('user');
setUser(null);
setIsAuthenticated(false);
} catch (error) {
console.error('Logout error:', error);
}
};

return (
<AuthContext.Provider
value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        checkAuth,
      }} >
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};
\`\`\`

---

## Testing Backend Directly (Before Frontend Integration)

Use these commands to test backend first:

### 1. **Test Signup**

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \\
-H "Content-Type: application/json" \\
-d '{
"name": "Test User",
"email": "test@sahihai.com",
"password": "test123"
}'
\`\`\`

Expected response:
\`\`\`json
{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "...",
"name": "Test User",
"email": "test@sahihai.com",
"createdAt": "..."
}
}
\`\`\`

### 2. **Test Login**

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "test@sahihai.com",
"password": "test123"
}'
\`\`\`

### 3. **Test Get Profile** (copy token from above)

\`\`\`bash
curl -X GET http://localhost:3000/api/auth/me \\
-H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

---

## Common Issues & Solutions

### Issue: "Network request failed"

**Solution:**

- Make sure backend server is running (`npm run dev` in server folder)
- Check API_URL matches your server IP
- Both devices must be on same WiFi network

### Issue: "MongoDB connection failed"

**Solution:**

- Add MongoDB connection string to `server/.env`:
  \`\`\`
  MONGODB_URI=mongodb://localhost:27017/sahihai
  \`\`\`
- Or use MongoDB Atlas cloud (free tier)

### Issue: "Email already registered"

**Solution:**

- Email already exists in database
- Use different email OR
- Clear database: In MongoDB shell run `db.users.deleteMany({})`

### Issue: Token expires

**Solution:**

- Tokens expire after 7 days
- User will need to login again
- Or implement refresh token mechanism

---

## Production Checklist

Before deploying:

- [ ] Change JWT_SECRET in server/.env to strong random string
- [ ] Use environment variable for API_URL in client
- [ ] Enable HTTPS (use ngrok for testing)
- [ ] Add rate limiting to auth endpoints
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Set up proper MongoDB Atlas cluster
- [ ] Add monitoring and error tracking
- [ ] Implement refresh tokens
- [ ] Add account lockout after failed attempts

---

## 🎉 Summary

✅ Backend auth system is complete and ready!
✅ JWT-based authentication
✅ Secure password hashing
✅ 5 endpoints (signup, login, profile, update, change password)
✅ Auth middleware for protected routes

**Next:** Update frontend AuthContext.js and test the complete flow!
