# 🚀 Quick Start Guide - SahiHai App

## Testing Your Updated App

### 1. Start the Development Server

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client
npm start
```

### 2. Test Authentication Flow

#### **Sign Up (First Time):**

1. App opens → Login screen appears
2. Tap "Sign Up" button at the bottom
3. Enter test data:
   - Name: `Test User`
   - Email: `test@sahihai.com`
   - Password: `test123`
   - Confirm Password: `test123`
4. Tap "Create Account"
5. Should navigate to Home screen ✅

#### **Log Out:**

1. Open drawer menu (swipe from left or tap hamburger icon)
2. Scroll to bottom
3. Tap "Logout" button
4. Should return to Login screen ✅

#### **Log In (Returning User):**

1. Enter credentials:
   - Email: `test@sahihai.com`
   - Password: `test123`
2. Tap "Login"
3. Should navigate to Home screen ✅

#### **Session Persistence:**

1. Close the app completely
2. Reopen the app
3. Should skip login and go directly to Home ✅
   _(If logged in before)_

---

## 3. Test Chat Assistant

1. Navigate to Chat tab (bottom tab bar)
2. Try quick action buttons:
   - "Scan Help" - Asks about scanning
   - "Report Scam" - Initiates scam report
   - "Legal Info" - Requests legal assistance
   - "FAQ" - General help
3. Type a custom message in the input
4. Tap send button (blue when text entered)
5. Should see:
   - Your message (right side, blue bubble)
   - Bot response (left side, gray bubble)
   - Timestamps on messages

**Note:** Currently shows demo responses. Connect to your AI backend for real responses.

---

## 4. Test Navigation

### **Drawer Navigation:**

1. Swipe from left edge OR
2. Tap hamburger menu icon (top-left)
3. Should see menu with:
   - Home
   - Scan Appliance
   - Inventory
   - Scam Scanner
   - Sarkari Saathi
   - Chat Assistant
   - Settings
   - Profile
   - Logout

### **Bottom Navigation (within drawer):**

- Home tab
- Scan tab
- Inventory tab
- Scam tab
- Sarkari tab
- Chat tab

All should be accessible and maintain state ✅

---

## 5. Test Theme (Light/Dark Mode)

1. Go to device settings
2. Toggle dark mode
3. App should automatically update colors
4. Test in both:
   - Login/Signup screens
   - All main screens
   - Chat interface
   - Drawer menu

---

## 6. Test on iOS (Important!)

**Check iOS-specific fixes:**

1. Top navigation bar (should not overlap status bar)
2. Bottom tab bar (should respect home indicator)
3. Safe areas (no content cut off)
4. Drawer gesture (swipe from left)

---

## 🔧 Backend Integration Checklist

### **Authentication API:**

Update `client/app/context/AuthContext.js` line 34-44:

```javascript
// Replace this simulated login
const login = async (email, password) => {
  try {
    setLoading(true);
    // REPLACE WITH YOUR API CALL:
    // const response = await fetch('YOUR_API_URL/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();

    // Simulated success for demo
    const userData = { id: 1, email, name: "Test User" };
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  } catch (error) {
    throw new Error("Login failed");
  } finally {
    setLoading(false);
  }
};
```

### **Chat AI Backend:**

Update `client/app/(tabs)/chat.js` line 56-65:

```javascript
// Replace simulated response
try {
  // REPLACE WITH YOUR API CALL:
  const response = await fetch('YOUR_API_URL/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });
  const data = await response.json();

  const botMessage = {
    id: (Date.now() + 1).toString(),
    text: data.response, // Use actual AI response
    sender: 'bot',
    timestamp: new Date(),
  };
```

---

## 📱 Platform-Specific Testing

### **iOS:**

- [x] Header height (should be 100px)
- [x] Status bar spacing
- [x] Tab bar padding (bottom)
- [x] Safe area insets
- [x] Drawer swipe gesture

### **Android:**

- [x] Header height (should be 80px)
- [x] Back button behavior
- [x] Tab bar height (68px)
- [x] System navigation bar

---

## 🐛 Troubleshooting

### **App won't start:**

```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start -- --reset-cache
```

### **Login screen not showing:**

Check:

1. AuthContext is imported in `_layout.js`
2. `checkAuth()` is being called on mount
3. No cached user data: Clear AsyncStorage

```javascript
// Add to login.js temporarily to clear storage
import AsyncStorage from "@react-native-async-storage/async-storage";
await AsyncStorage.clear();
```

### **Navigation broken:**

1. Verify drawer is in `(tabs)/_layout.js`
2. Check all screen files exist
3. Ensure `useAuth()` hook is working

### **Theme colors wrong:**

1. Check ThemeContext is wrapping the app
2. Verify `useTheme()` hook is called in components
3. Colors defined in `constants/theme.ts`

---

## 📊 Testing Checklist

- [ ] Sign up new user
- [ ] Log out
- [ ] Log back in
- [ ] Close and reopen app (session persists)
- [ ] Open all tabs (Home, Scan, Inventory, Scam, Sarkari, Chat)
- [ ] Open drawer menu
- [ ] Send chat messages
- [ ] Try quick actions in chat
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Toggle light/dark mode
- [ ] Verify splash screen shows
- [ ] Check loading states
- [ ] Test error cases (wrong password, no internet)

---

## 🎯 Next Development Steps

1. **Connect Authentication Backend**

   - Implement real login/signup API
   - Add password reset flow
   - Implement email verification

2. **Integrate Chat AI**

   - Connect to OpenAI/Groq/Gemini
   - Add conversation history
   - Implement context awareness

3. **Enhance Features**

   - Add profile editing
   - Implement settings screen
   - Add push notifications

4. **Polish UI/UX**

   - Add animations
   - Improve error messages
   - Add haptic feedback

5. **Prepare for Production**
   - Add analytics
   - Implement crash reporting
   - Set up CI/CD
   - Prepare app store listings

---

## 📞 Support

If you encounter issues:

1. Check the UPDATE_SUMMARY.md for detailed changes
2. Review error logs in terminal
3. Check React Native debugger
4. Verify all dependencies installed: `npm install`

Happy testing! 🚀
