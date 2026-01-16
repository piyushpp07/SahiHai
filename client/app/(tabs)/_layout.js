import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.ACCENT,
          height: Platform.OS === "ios" ? 100 : undefined,
        },
        headerTintColor: colors.WHITE,
        headerTitleAlign: "center",
        headerTitle: "SahiHai",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 22,
          letterSpacing: 1,
          color: colors.WHITE,
        },
        headerStatusBarHeight: Platform.OS === "ios" ? 44 : 0,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/menu")}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={28} color={colors.WHITE} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            style={{ marginRight: 15 }}
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={colors.WHITE}
            />
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: colors.ACCENT,
        tabBarInactiveTintColor: colors.TEXT_TERTIARY,
        tabBarStyle: {
          backgroundColor: colors.BG_SECONDARY,
          borderTopWidth: 0.5,
          borderTopColor: colors.BORDER,
          height: Platform.OS === "ios" ? 75 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 5,
          paddingTop: 5,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Loot Meter",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "speedometer" : "speedometer-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cube" : "cube-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scam"
        options={{
          title: "Scam",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "alert-circle" : "alert-circle-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sarkari"
        options={{
          href: null, // Hide from tab bar
          title: "Sarkari Saathi",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tab bar
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
