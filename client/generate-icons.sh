#!/bin/bash

# SahiHai Icon & Splash Screen Generator
# This script converts SVG templates to PNG assets for the app
# Requires: ImageMagick (brew install imagemagick)

set -e  # Exit on error

echo "🎨 SahiHai Icon & Splash Screen Generator"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ Error: ImageMagick is not installed${NC}"
    echo "Please install ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

# Use 'magick' or 'convert' depending on ImageMagick version
if command -v magick &> /dev/null; then
    CONVERT="magick"
else
    CONVERT="convert"
fi

echo -e "${BLUE}ℹ️  Using ImageMagick: $CONVERT${NC}"

# Paths
ASSETS_DIR="./assets"
IMAGES_DIR="$ASSETS_DIR/images"
SVG_ICON_1="$ASSETS_DIR/icon-template-1.svg"
SVG_ICON_2="$ASSETS_DIR/icon-template-2.svg"
SVG_SPLASH="$ASSETS_DIR/splash-template.svg"

# Create images directory if it doesn't exist
mkdir -p "$IMAGES_DIR"

# Ask user which icon design to use
echo ""
echo "Which icon design would you like to use?"
echo "1) Shield with Checkmark (Recommended - security/protection theme)"
echo "2) Bill Scanner (Feature-focused - scanning theme)"
read -p "Enter choice (1 or 2): " ICON_CHOICE

if [ "$ICON_CHOICE" == "2" ]; then
    SVG_ICON="$SVG_ICON_2"
    echo -e "${GREEN}✓ Using Bill Scanner design${NC}"
else
    SVG_ICON="$SVG_ICON_1"
    echo -e "${GREEN}✓ Using Shield with Checkmark design${NC}"
fi

# Check if SVG files exist
if [ ! -f "$SVG_ICON" ]; then
    echo -e "${RED}❌ Error: Icon template not found: $SVG_ICON${NC}"
    exit 1
fi

if [ ! -f "$SVG_SPLASH" ]; then
    echo -e "${RED}❌ Error: Splash template not found: $SVG_SPLASH${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📦 Generating app icons...${NC}"

# Generate main app icon (1024x1024)
echo "  • Creating icon.png (1024x1024)..."
$CONVERT "$SVG_ICON" -resize 1024x1024 -background none "$IMAGES_DIR/icon.png"

# Generate iOS icons
echo "  • Creating iOS icons..."
$CONVERT "$SVG_ICON" -resize 180x180 -background none "$IMAGES_DIR/icon-180.png"
$CONVERT "$SVG_ICON" -resize 120x120 -background none "$IMAGES_DIR/icon-120.png"
$CONVERT "$SVG_ICON" -resize 167x167 -background none "$IMAGES_DIR/icon-167.png"
$CONVERT "$SVG_ICON" -resize 152x152 -background none "$IMAGES_DIR/icon-152.png"
$CONVERT "$SVG_ICON" -resize 76x76 -background none "$IMAGES_DIR/icon-76.png"

echo ""
echo -e "${YELLOW}🤖 Generating Android adaptive icons...${NC}"

# Android Foreground (432x432 with transparency)
echo "  • Creating android-icon-foreground.png (432x432)..."
$CONVERT "$SVG_ICON" -resize 432x432 -background none "$IMAGES_DIR/android-icon-foreground.png"

# Android Background (432x432 with gradient)
echo "  • Creating android-icon-background.png (432x432)..."
$CONVERT -size 432x432 \
  gradient:"#1976d2-#00b894" \
  -rotate 135 \
  "$IMAGES_DIR/android-icon-background.png"

# Android Monochrome (432x432 grayscale)
echo "  • Creating android-icon-monochrome.png (432x432)..."
$CONVERT "$SVG_ICON" \
  -resize 432x432 \
  -background none \
  -alpha extract \
  -negate \
  "$IMAGES_DIR/android-icon-monochrome.png"

echo ""
echo -e "${YELLOW}🌅 Generating splash screen...${NC}"

# Splash icon (400x400 for display at 200x200)
echo "  • Creating splash-icon.png (400x400)..."
$CONVERT "$SVG_SPLASH" -resize 400x400 -background none "$IMAGES_DIR/splash-icon.png"

echo ""
echo -e "${YELLOW}🌐 Generating web favicon...${NC}"

# Favicon (48x48)
echo "  • Creating favicon.png (48x48)..."
$CONVERT "$SVG_ICON" -resize 48x48 -background none "$IMAGES_DIR/favicon.png"

# Also create favicon.ico
echo "  • Creating favicon.ico..."
$CONVERT "$SVG_ICON" -resize 32x32 -background none "$IMAGES_DIR/favicon.ico"

echo ""
echo -e "${GREEN}=========================================="
echo "✅ All icons generated successfully!"
echo "==========================================${NC}"

echo ""
echo "📁 Generated files in $IMAGES_DIR:"
echo "  • icon.png (1024x1024) - Main app icon"
echo "  • android-icon-foreground.png (432x432)"
echo "  • android-icon-background.png (432x432)"
echo "  • android-icon-monochrome.png (432x432)"
echo "  • splash-icon.png (400x400)"
echo "  • favicon.png (48x48)"
echo "  • favicon.ico (32x32)"

echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo "  1. Review the generated icons in: $IMAGES_DIR"
echo "  2. Run: cd .. && npx expo start -c"
echo "  3. Test the app to see new icons and splash screen"
echo ""
echo -e "${GREEN}✓ Done!${NC}"
