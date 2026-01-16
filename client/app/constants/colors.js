// constants/colors.js

const commonColors = {
  white: '#FFFFFF',
  black: '#000000',
  grey: '#A9A9A9',
};

export const LIGHT_COLORS = {
  ...commonColors,
  primary: '#5D3FD3', // Royal Purple
  secondary: '#FF9F1C', // Alert Orange
  success: '#00C851', // Whatsapp Green
  surface: '#FFFFFF', // Cards
  background: '#F4F6F8', // Light Gray Background
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  error: '#D32F2F',
  // Theme-specific names from original ThemeContext
  BG_PRIMARY: '#F4F6F8',
  BG_SECONDARY: '#FFFFFF',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6C757D',
  ACCENT: '#5D3FD3',
  ERROR: '#D32F2F',
  SUCCESS: '#00C851',
  WARNING: '#FF9F1C',
  BORDER: '#E0E0E0',
  CARD: '#FFFFFF',
};

export const DARK_COLORS = {
  ...commonColors,
  primary: '#7B5FFC', // Lighter Royal Purple for dark mode
  secondary: '#FFB84D', // Lighter Alert Orange
  success: '#00E676', // Lighter Green
  surface: '#1E1E1E', // Darker surface for cards
  background: '#121212', // Standard dark mode background
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  error: '#EF5350', // Lighter Red
  // Theme-specific names from original ThemeContext
  BG_PRIMARY: '#121212',
  BG_SECONDARY: '#1E1E1E',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B0B0B0',
  ACCENT: '#7B5FFC',
  ERROR: '#EF5350',
  SUCCESS: '#00E676',
  WARNING: '#FFB84D',
  BORDER: '#333333',
  CARD: '#1E1E1E',
};
