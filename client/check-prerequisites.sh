#!/bin/bash

# SahiHai - Check Icon Generation Prerequisites
# This script checks if everything is ready to generate icons

set -e

echo "🔍 SahiHai Icon Generation - Prerequisites Check"
echo "================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check 1: ImageMagick
echo -n "Checking ImageMagick... "
if command -v magick &> /dev/null || command -v convert &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    if command -v magick &> /dev/null; then
        VERSION=$(magick --version | head -n 1)
        echo "  → $VERSION"
    else
        VERSION=$(convert --version | head -n 1)
        echo "  → $VERSION"
    fi
else
    echo -e "${RED}✗ Not installed${NC}"
    echo "  → Install with: brew install imagemagick"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check 2: SVG Templates
echo "Checking SVG templates..."
TEMPLATES=(
    "assets/icon-template-1.svg"
    "assets/icon-template-2.svg"
    "assets/splash-template.svg"
)

for template in "${TEMPLATES[@]}"; do
    echo -n "  - $template... "
    if [ -f "$template" ]; then
        echo -e "${GREEN}✓ Found${NC}"
    else
        echo -e "${RED}✗ Missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check 3: Output Directory
echo -n "Checking output directory (assets/images)... "
if [ -d "assets/images" ]; then
    echo -e "${GREEN}✓ Exists${NC}"
else
    echo -e "${YELLOW}⚠ Missing${NC}"
    echo "  → Creating directory..."
    mkdir -p assets/images
    echo -e "  ${GREEN}✓ Created${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check 4: Generation Script
echo -n "Checking generation script... "
if [ -f "generate-icons.sh" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    if [ -x "generate-icons.sh" ]; then
        echo "  → Executable: Yes"
    else
        echo -e "  ${YELLOW}→ Executable: No${NC}"
        echo "  → Making executable..."
        chmod +x generate-icons.sh
        echo -e "  ${GREEN}✓ Done${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ Missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check 5: app.json Configuration
echo "Checking app.json configuration..."
if [ -f "app.json" ]; then
    echo -e "${GREEN}✓ app.json exists${NC}"
    
    # Check icon path
    if grep -q '"icon": "./assets/images/icon.png"' app.json; then
        echo -e "  ${GREEN}✓ Icon path configured${NC}"
    else
        echo -e "  ${YELLOW}⚠ Icon path may need updating${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check splash
    if grep -q '"image": "./assets/images/splash-icon.png"' app.json; then
        echo -e "  ${GREEN}✓ Splash screen configured${NC}"
    else
        echo -e "  ${YELLOW}⚠ Splash screen may need updating${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check adaptive icons
    if grep -q 'android-icon-foreground.png' app.json; then
        echo -e "  ${GREEN}✓ Android adaptive icons configured${NC}"
    else
        echo -e "  ${YELLOW}⚠ Android adaptive icons may need updating${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ app.json not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check 6: Existing Icons (backup warning)
echo "Checking for existing icons..."
EXISTING_ICONS=(
    "assets/images/icon.png"
    "assets/images/splash-icon.png"
)

FOUND_EXISTING=0
for icon in "${EXISTING_ICONS[@]}"; do
    if [ -f "$icon" ]; then
        FOUND_EXISTING=1
        echo -e "  ${YELLOW}⚠ Found: $icon${NC}"
    fi
done

if [ $FOUND_EXISTING -eq 1 ]; then
    echo -e "${YELLOW}  → Running generation will overwrite existing files${NC}"
    echo "  → Consider backing up first!"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ No existing icons (fresh start)${NC}"
fi

echo ""
echo "================================================="

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to generate icons.${NC}"
    echo ""
    echo "Next step:"
    echo "  ./generate-icons.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Ready with $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can proceed, but review warnings above."
    echo ""
    echo "Next step:"
    echo "  ./generate-icons.sh"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix errors before generating icons."
    echo ""
    echo "Quick fixes:"
    if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
        echo "  → Install ImageMagick: brew install imagemagick"
    fi
    echo "  → Ensure you're in the client directory"
    echo "  → Check that SVG templates exist"
    exit 1
fi
