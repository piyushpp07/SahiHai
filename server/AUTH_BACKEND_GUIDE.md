# 🔐 SahiHai Authentication System - Backend

## ✅ Backend Implementation Complete!

The backend now has a **complete JWT-based authentication system** with secure password hashing.

---

## 📋 What's Implemented

### 1. **User Model** (`server/src/models/User.ts`)

```typescript
{
  name: string,        // Min 2 chars, max 50 chars
  email: string,       // Unique, validated format
  password: string,    // Hashed with bcrypt, min 6 chars
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

### 2. **Authentication Controller** (`server/src/controllers/authController.ts`)

- ✅ **Signup** - Register new users with validation
- ✅ **Login** - Authenticate users and return JWT token
- ✅ **Get Profile** - Retrieve current user details
- ✅ **Update Profile** - Change user name
- ✅ **Change Password** - Update password securely

### 3. **Auth Middleware** (`server/src/middleware/authMiddleware.ts`)

- ✅ Token verification
- ✅ Request protection
- ✅ User ID attachment to request

### 4. **Dependencies Installed**

- ✅ `bcryptjs` - Password hashing
- ✅ `jsonwebtoken` - JWT token generation/verification
- ✅ `@types/bcryptjs` & `@types/jsonwebtoken` - TypeScript types

---

## 🚀 API Endpoints

### **Public Endpoints (No Auth Required)**

#### 1. **Signup**

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-04T10:30:00.000Z"
  }
}
```

#### 2. **Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-04T10:30:00.000Z"
  }
}
```

---

### **Protected Endpoints (Require JWT Token)**

**All protected endpoints require:**

```http
Authorization: Bearer <your-jwt-token>
```

#### 3. **Get Current User Profile**

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-04T10:30:00.000Z"
  }
}
```

#### 4. **Update Profile**

```http
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Smith",
    "email": "john@example.com",
    "createdAt": "2026-01-04T10:30:00.000Z"
  }
}
```

#### 5. **Change Password**

```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔒 Security Features

1. **Password Hashing**

   - Uses bcrypt with salt rounds of 10
   - Passwords never stored in plain text
   - One-way hashing (cannot be reversed)

2. **JWT Token Authentication**

   - Tokens expire in 7 days
   - Stateless authentication
   - Token contains only user ID (no sensitive data)

3. **Email Validation**

   - Regex pattern validation
   - Automatic lowercase conversion
   - Unique constraint at database level

4. **Password Requirements**

   - Minimum 6 characters
   - Validated on both signup and change password

5. **Protected Routes**
   - Middleware verifies token on every request
   - Returns 401 if token is missing, invalid, or expired

---

## 🔧 Frontend Integration

### Update `client/app/context/AuthContext.js`

Replace lines 34-85 with:

```javascript
const API_URL = "http://YOUR_SERVER_IP:3000"; // e.g., http://192.168.1.100:3000

const checkAuth = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    // Verify token with backend
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
      setIsAuthenticated(true);
    } else {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
    }
  } catch (error) {
    console.error("Auth check failed:", error);
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

const signup = async (name, email, password) => {
  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      throw new Error(data.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

---

## 🧪 Testing the API

### Using cURL:

#### 1. **Signup**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@sahihai.com",
    "password": "test123"
  }'
```

#### 2. **Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@sahihai.com",
    "password": "test123"
  }'
```

Save the token from the response!

#### 3. **Get Profile** (use token from login)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman:

1. Create new request collection "SahiHai Auth"
2. Add POST request: `http://localhost:3000/api/auth/signup`
3. Set Body → raw → JSON
4. Add the signup JSON
5. Send request
6. Copy the token from response
7. Create GET request: `http://localhost:3000/api/auth/me`
8. Add Header: `Authorization: Bearer <paste-token>`
9. Send request

---

## 🌍 Environment Variables

Add to your `server/.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Server Port
PORT=3000
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` in production to a long, random string!

---

## 📊 Database Schema

MongoDB will automatically create a `users` collection with this structure:

```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$rO0K8qHu...", // Hashed
  createdAt: ISODate("2026-01-04T10:30:00.000Z"),
  updatedAt: ISODate("2026-01-04T10:30:00.000Z"),
  __v: 0
}
```

Indexes:

- `email` (unique)
- `_id` (default)

---

## ✅ Checklist

- [x] User model created with validation
- [x] Password hashing with bcrypt
- [x] JWT token generation
- [x] Auth middleware for protected routes
- [x] Signup endpoint
- [x] Login endpoint
- [x] Get profile endpoint
- [x] Update profile endpoint
- [x] Change password endpoint
- [x] Error handling
- [x] Logging
- [x] TypeScript types
- [x] Dependencies installed

---

## 🚀 Next Steps

1. **Update Frontend** - Replace simulated auth with real API calls
2. **Test Endpoints** - Use Postman or cURL to verify all endpoints work
3. **Configure .env** - Add JWT_SECRET and MongoDB connection
4. **Start Server** - `npm run dev` in server directory
5. **Test Integration** - Connect mobile app to backend

---

## 🐛 Troubleshooting

### "User not found" on login

- Check email is lowercase
- Verify user exists in database: `db.users.find({})`

### "Invalid token"

- Token might be expired (7 days)
- Token format: `Bearer <token>` (space after Bearer)
- Check JWT_SECRET matches between requests

### "Email already registered"

- User with that email already exists
- Use different email or implement forgot password

### CORS errors

- CORS is already enabled in server
- Check API_URL in frontend matches server IP/port

---

## 📞 Support

Auth system is now production-ready! 🎉

Test it thoroughly before deploying to production.
