# 🚀 Quick Start: Generate Your App Icons & Splash Screen

## ✅ Step 1: Check ImageMagick Installation

```bash
# Check if ImageMagick is installed
magick --version
# OR
convert --version
```

If not installed:

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# Download from: https://imagemagick.org/script/download.php
```

---

## 🎨 Step 2: Generate Icons

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client
./generate-icons.sh
```

The script will ask you to choose a design:

- **Option 1**: Shield with Checkmark (Security/Protection theme) ✅ **Recommended**
- **Option 2**: Bill Scanner (Feature-focused theme)

---

## 📦 What Gets Generated

After running the script, you'll have:

```
client/assets/images/
├── icon.png (1024x1024) ✅ Main app icon
├── android-icon-foreground.png (432x432) ✅ Android adaptive
├── android-icon-background.png (432x432) ✅ Android adaptive
├── android-icon-monochrome.png (432x432) ✅ Android monochrome
├── splash-icon.png (400x400) ✅ Splash screen
├── favicon.png (48x48) ✅ Web favicon
└── favicon.ico (32x32) ✅ Browser icon
```

---

## 🧪 Step 3: Test Your New Icons

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client
npx expo start -c
```

The `-c` flag clears cache to ensure new icons load.

---

## 📱 Preview

### **Light Mode Splash:**

```
┌─────────────────────────────┐
│                             │
│                             │
│         [Your Icon]         │
│       Shield + Check        │
│          (200x200)          │
│                             │
│         SahiHai             │
│                             │
└─────────────────────────────┘
White background
```

### **Dark Mode Splash:**

```
┌─────────────────────────────┐
│                             │
│                             │
│         [Your Icon]         │
│       Shield + Check        │
│          (200x200)          │
│                             │
│         SahiHai             │
│                             │
└─────────────────────────────┘
Black background (#121212)
```

---

## 🎯 Alternative: Manual Conversion

If you don't want to use the script, convert SVGs manually:

### **Using Online Tools:**

1. **SVG to PNG Converter**

   - Go to: https://svgtopng.com/
   - Upload `icon-template-1.svg` or `icon-template-2.svg`
   - Set width: 1024px, height: 1024px
   - Download as `icon.png`

2. **For Splash Screen:**

   - Upload `splash-template.svg`
   - Set width: 400px, height: 400px
   - Download as `splash-icon.png`

3. **For Android Adaptive:**
   - Upload icon again
   - Set width: 432px, height: 432px
   - Download as `android-icon-foreground.png`

---

## 🛠️ Troubleshooting

### **Problem: "ImageMagick not found"**

**Solution:** Install ImageMagick:

```bash
brew install imagemagick  # macOS
```

### **Problem: "Permission denied"**

**Solution:** Make script executable:

```bash
chmod +x generate-icons.sh
```

### **Problem: "Icons not updating in app"**

**Solution:** Clear cache:

```bash
npx expo start -c
# or
rm -rf node_modules/.cache
npx expo start
```

### **Problem: "SVG files not found"**

**Solution:** Make sure you're in the client directory:

```bash
cd /Users/piyushparadkar/Desktop/SahiHai/client
ls assets/*.svg  # Should see the SVG files
```

---

## 🎨 Customize Colors (Optional)

Edit the SVG files to change colors:

Open `assets/icon-template-1.svg` and modify:

```svg
<!-- Change gradient colors -->
<stop offset="0%" style="stop-color:#1976d2;stop-opacity:1" />
<!-- To your preferred color -->
<stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
```

Then re-run the generation script.

---

## 🚀 After Generation

### **Test on Different Themes:**

1. **iOS Simulator:**

   ```bash
   npx expo run:ios
   ```

   - Go to Settings → Display & Brightness
   - Toggle Light/Dark mode
   - Check splash screen

2. **Android Emulator:**
   ```bash
   npx expo run:android
   ```
   - Go to Settings → Display
   - Toggle Dark theme
   - Check adaptive icons

---

## 📋 Verification Checklist

```
[ ] Icons generated successfully
[ ] Splash screen looks good in light mode
[ ] Splash screen looks good in dark mode
[ ] Android adaptive icons display correctly
[ ] iOS icons display correctly
[ ] App name shows correctly
[ ] Colors match brand identity
```

---

## 🎉 Next Steps

Once icons are generated and tested:

1. **Update app.json if needed:**

   ```json
   {
     "expo": {
       "name": "SahiHai",
       "slug": "sahihai"
     }
   }
   ```

2. **Build for production:**

   ```bash
   eas build --platform all
   ```

3. **Submit to stores:**
   - Icons will be automatically included
   - Splash screen configured
   - Ready for deployment! 🚀

---

**Need help?** Check `ICON_SPLASH_GUIDE.md` for detailed information.

**Want to customize further?** Edit the SVG templates in `assets/` folder.
