# 🚀 Quick Start: Theme Migration Guide

## Overview

Your SahiHai app now has a complete theme system with automatic dark mode! The infrastructure is ready, and the home screen demonstrates the implementation.

---

## ✅ What's Already Done

1. **Theme System** (`client/app/context/ThemeContext.js`)

   - Automatic system theme detection
   - React Context provider
   - `useTheme()` hook

2. **Color System** (`client/app/constants/colors.js`)

   - 60+ semantic color tokens
   - Light and dark mode support
   - Design system (spacing, shadows, typography)

3. **Root Integration** (`client/app/_layout.js`)

   - ThemeProvider wrapping entire app
   - StatusBar themed

4. **Example Implementation** (`client/app/(tabs)/home.js`)
   - Fully migrated to use theme
   - No compilation errors
   - Ready to test

---

## 🎯 Next Steps: Migrate Remaining Screens

### **Screen Priority List:**

1. `scan.js` - Scanner tab
2. `scam.js` - Scam checker tab
3. `sarkari.js` - Legal aid tab
4. `history.js` - History tab
5. `explore.js` - Explore tab
6. `ModernHeader.js` - Header component
7. Feature screens (camera, result, etc.)

---

## 📋 Step-by-Step Migration Template

### **For Each Screen File:**

#### **Step 1: Update Imports**

```javascript
// REMOVE this line:
import { COLORS, SHADOWS, ... } from "../constants/colors";

// REPLACE with:
import { useTheme } from "../context/ThemeContext";
import { SHADOWS, SPACING, ... } from "../constants/colors";
// Note: Keep SHADOWS, SPACING, etc. - only remove COLORS
```

#### **Step 2: Get Theme in Component**

```javascript
export default function MyScreen() {
  // Add this line at the top of your component:
  const { colors } = useTheme();

  // Rest of your component...
}
```

#### **Step 3: Replace COLORS with colors**

Use find & replace in your editor:

- Find: `COLORS.ACCENT` → Replace: `colors.ACCENT`
- Find: `COLORS.SUCCESS` → Replace: `colors.SUCCESS`
- Find: `COLORS.DANGER` → Replace: `colors.DANGER`
- Find: `COLORS.WARNING` → Replace: `colors.WARNING`
- Find: `COLORS.TEXT_PRIMARY` → Replace: `colors.TEXT_PRIMARY`
- Find: `COLORS.TEXT_SECONDARY` → Replace: `colors.TEXT_SECONDARY`
- Find: `COLORS.TEXT_LIGHT` → Replace: `colors.TEXT_TERTIARY`
- Find: `COLORS.BG_PRIMARY` → Replace: `colors.BG_PRIMARY`
- Find: `COLORS.BG_SECONDARY` → Replace: `colors.BG_PRIMARY`
- Find: `COLORS.WHITE` → Replace: `colors.BG_CARD`
- Find: `COLORS.GRAY_MEDIUM` → Replace: `colors.TEXT_TERTIARY`

#### **Step 4: Update StyleSheet**

```javascript
// BEFORE:
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE, // ❌ Remove
    color: COLORS.TEXT_PRIMARY, // ❌ Remove
    padding: SPACING.lg, // ✅ Keep
  },
});

// AFTER:
const styles = StyleSheet.create({
  container: {
    // Remove all color references
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
});
```

#### **Step 5: Apply Colors Dynamically**

```javascript
// BEFORE:
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

// AFTER:
<View style={[styles.container, { backgroundColor: colors.BG_CARD }]}>
  <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
    Title
  </Text>
</View>
```

#### **Step 6: Check for Errors**

```bash
# Run linter to find any remaining COLORS references:
npx eslint client/app/(tabs)/your-file.js
```

---

## 🎨 Common Patterns

### **Pattern 1: Container Background**

```javascript
<View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
```

### **Pattern 2: Card Background**

```javascript
<View style={[styles.card, SHADOWS.md, { backgroundColor: colors.BG_CARD }]}>
```

### **Pattern 3: Text Colors**

```javascript
<Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Title</Text>
<Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>Subtitle</Text>
<Text style={[styles.hint, { color: colors.TEXT_TERTIARY }]}>Hint</Text>
```

### **Pattern 4: Icon Colors**

```javascript
<Ionicons name="icon" size={24} color={colors.ACCENT} />
<Ionicons name="checkmark" size={20} color={colors.SUCCESS} />
<Ionicons name="alert" size={20} color={colors.DANGER} />
```

### **Pattern 5: Buttons**

```javascript
<TouchableOpacity style={[styles.button, { backgroundColor: colors.ACCENT }]}>
  <Text style={[styles.buttonText, { color: colors.WHITE }]}>Submit</Text>
</TouchableOpacity>
```

### **Pattern 6: Borders**

```javascript
<View
  style={[
    styles.input,
    {
      backgroundColor: colors.BG_INPUT,
      borderColor: colors.BORDER_LIGHT,
    },
  ]}
>
```

### **Pattern 7: Loading Indicator**

```javascript
<ActivityIndicator size="large" color={colors.ACCENT} />
```

### **Pattern 8: Semantic Colors**

```javascript
// Success state
<View style={{ backgroundColor: `${colors.SUCCESS}20` }}>
  <Text style={{ color: colors.SUCCESS }}>Success!</Text>
</View>

// Error state
<View style={{ backgroundColor: `${colors.DANGER}20` }}>
  <Text style={{ color: colors.DANGER }}>Error!</Text>
</View>

// Warning state
<View style={{ backgroundColor: `${colors.WARNING}20` }}>
  <Text style={{ color: colors.WARNING }}>Warning!</Text>
</View>
```

---

## 🔍 Example: Migrate scan.js

Let me show you exactly how to migrate the scan tab:

### **Original scan.js:**

```javascript
import { COLORS, SHADOWS, SPACING } from "../constants/colors";

export default function ScanTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  title: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
  },
});
```

### **Migrated scan.js:**

```javascript
import { useTheme } from "../context/ThemeContext";
import { SHADOWS, SPACING } from "../constants/colors";

export default function ScanTab() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>Scan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
});
```

**Changes Made:**

1. ✅ Imported `useTheme` instead of `COLORS`
2. ✅ Called `useTheme()` in component
3. ✅ Removed `COLORS` import
4. ✅ Removed colors from StyleSheet
5. ✅ Applied colors dynamically with inline styles

---

## ⚠️ Common Mistakes to Avoid

### ❌ **Mistake 1: Colors in StyleSheet**

```javascript
// DON'T DO THIS:
const { colors } = useTheme();
const styles = StyleSheet.create({
  text: { color: colors.TEXT_PRIMARY }, // ❌ Won't update!
});
```

**Why:** StyleSheet is created once, won't react to theme changes.

### ❌ **Mistake 2: Hardcoded Colors**

```javascript
// DON'T DO THIS:
<View style={{ backgroundColor: "#FFFFFF" }}>  // ❌ Fixed color!
```

**Solution:** Always use `colors.BG_CARD` or semantic names.

### ❌ **Mistake 3: Using COLORS Directly**

```javascript
// DON'T DO THIS:
import { COLORS } from "../constants/colors";
<Text style={{ color: COLORS.TEXT_PRIMARY }}>  // ❌ Static!
```

**Solution:** Use `colors.TEXT_PRIMARY` from `useTheme()`.

### ❌ **Mistake 4: Forgetting Inline Styles**

```javascript
// DON'T DO THIS:
<View style={styles.container}>  // ❌ Missing dynamic colors!

// DO THIS:
<View style={[styles.container, { backgroundColor: colors.BG_CARD }]}>  // ✅
```

---

## 🧪 Testing Your Changes

### **Visual Test:**

1. Open your migrated screen
2. Toggle device to dark mode (Settings → Display → Dark)
3. Verify colors adapt automatically
4. Toggle back to light mode
5. Check smooth transition

### **Code Test:**

```bash
# Check for linting errors:
npx eslint client/app/(tabs)/your-file.js

# Check for remaining COLORS usage:
grep -n "COLORS\." client/app/(tabs)/your-file.js
```

### **Expected Result:**

- No console errors
- No `COLORS.` references found
- Colors adapt to system theme
- Smooth transitions

---

## 📊 Progress Tracking

### **Checklist:**

```
Infrastructure:
[x] ThemeContext created
[x] Color system expanded
[x] Root layout integrated

Tab Screens:
[x] home.js - COMPLETE ✅
[ ] scan.js
[ ] scam.js
[ ] sarkari.js
[ ] history.js
[ ] explore.js

Components:
[ ] ModernHeader.js
[ ] CustomDrawer.js (if exists)
[ ] Modal components

Feature Screens:
[ ] camera.tsx
[ ] result.tsx
[ ] Other feature screens
```

---

## 🆘 Troubleshooting

### **Problem: "COLORS is not defined"**

**Solution:** You forgot to replace COLORS with colors. Use find & replace.

### **Problem: "useTheme is not defined"**

**Solution:** Add `import { useTheme } from "../context/ThemeContext";`

### **Problem: "colors is assigned but never used"**

**Solution:** You imported useTheme but didn't apply colors. Check Step 5.

### **Problem: "Cannot read property 'ACCENT' of undefined"**

**Solution:** Make sure you called `const { colors } = useTheme();` inside the component.

### **Problem: Colors not updating when switching theme**

**Solution:** Check that colors are applied inline, not in StyleSheet.

---

## 💡 Pro Tips

1. **Use Semantic Names:**

   - ✅ `colors.TEXT_PRIMARY` (clear purpose)
   - ❌ `colors.GRAY_700` (unclear)

2. **Leverage VSCode:**

   - Use multi-cursor editing (Cmd+D on Mac)
   - Find & replace across files
   - Use ESLint extension for real-time errors

3. **Test Incrementally:**

   - Migrate one screen at a time
   - Test before moving to next
   - Commit after each successful migration

4. **Reference home.js:**

   - It's your template
   - Copy patterns from it
   - All edge cases handled

5. **Use Common Styles:**
   ```javascript
   import { COMMON_STYLES } from "../constants/colors";
   style={[COMMON_STYLES.card, { backgroundColor: colors.BG_CARD }]}
   ```

---

## 📚 References

- **Working Example:** `client/app/(tabs)/home.js`
- **Theme Provider:** `client/app/context/ThemeContext.js`
- **Color System:** `client/app/constants/colors.js`
- **Complete Guide:** `client/UI_IMPROVEMENTS.md`
- **Visual Comparison:** `client/VISUAL_COMPARISON.md`

---

## 🎯 Your Next Action

1. **Open** `client/app/(tabs)/scan.js`
2. **Follow** the step-by-step template above
3. **Test** by toggling dark mode
4. **Commit** when successful
5. **Repeat** for remaining screens

**Estimated Time:** 15-30 minutes per screen

---

**Good luck! You've got this! 🚀**

If you get stuck, just look at `home.js` - it has all the answers!
