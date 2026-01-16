import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_COLORS, DARK_COLORS } from "../constants/colors";

const ThemeContext = createContext({
  theme: "light",
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null
  const [theme, setTheme] = useState(systemColorScheme || "light");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when system theme changes (only if no user preference)
  useEffect(() => {
    if (!isLoading && systemColorScheme) {
      // Only use system theme if user hasn't set a preference
      AsyncStorage.getItem("@theme_preference").then((savedTheme) => {
        if (!savedTheme && systemColorScheme) {
          setTheme(systemColorScheme);
        }
      });
    }
  }, [systemColorScheme, isLoading]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("@theme_preference");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("@theme_preference", newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const isDark = theme === "dark";

  const value = {
    theme,
    colors,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
