// Modern color palette for SahiHai app
export const COLORS = {
  // Primary
  ACCENT: "#1976d2",
  ACCENT_LIGHT: "#42a5f5",
  ACCENT_DARK: "#1565c0",

  // Secondary
  SUCCESS: "#00b894",
  DANGER: "#e17055",
  WARNING: "#fdcb6e",
  INFO: "#74b9ff",

  // Neutral
  WHITE: "#ffffff",
  BLACK: "#000000",
  GRAY_LIGHT: "#f5f5f5",
  GRAY_MEDIUM: "#e0e0e0",
  GRAY_DARK: "#636e72",
  GRAY_DARKER: "#2d3436",

  // Backgrounds
  BG_PRIMARY: "#ffffff",
  BG_SECONDARY: "#f8f9fa",

  // Text
  TEXT_PRIMARY: "#2d3436",
  TEXT_SECONDARY: "#636e72",
  TEXT_LIGHT: "#b2bec3",
};

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

export const FONT_WEIGHTS = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

// Default export for the module
export default COLORS;
