import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function CustomDrawerContent(props) {
  const [userProfile] = useState({
    name: "User Profile",
    email: "user@sahahai.app",
    avatar: "👤",
  });

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      action: () => props.navigation.navigate("(tabs)"),
    },
    {
      id: "scan",
      label: "Scan Appliance",
      icon: "scan-circle",
      action: () => props.navigation.navigate("(tabs)", { screen: "scan" }),
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "cube",
      action: () =>
        props.navigation.navigate("(tabs)", { screen: "inventory" }),
    },
    {
      id: "scam",
      label: "Scam Scanner",
      icon: "alert-circle",
      action: () => props.navigation.navigate("(tabs)", { screen: "scam" }),
    },
    {
      id: "sarkari",
      label: "Sarkari Saathi",
      icon: "document-text",
      action: () => props.navigation.navigate("(tabs)", { screen: "sarkari" }),
    },
  ];

  const otherItems = [
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle",
    },
    {
      id: "about",
      label: "About SahiHai",
      icon: "information-circle",
    },
  ];

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        {/* Profile Section */}
        <View style={[styles.profileSection, SHADOWS.md]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{userProfile.avatar}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>FEATURES</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                item.action();
                props.navigation.closeDrawer();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons name={item.icon} size={24} color={COLORS.ACCENT} />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.GRAY_MEDIUM}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>MORE</Text>
          {otherItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={COLORS.TEXT_SECONDARY}
                />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.GRAY_MEDIUM}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Scans Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹5,240</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[styles.drawerFooter, SHADOWS.sm]}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color={COLORS.DANGER} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  profileSection: {
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.ACCENT}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.lg,
  },
  avatar: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  menuSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  menuLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.md,
    marginLeft: SPACING.md,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.WHITE,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.ACCENT}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
    color: COLORS.TEXT_PRIMARY,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    color: COLORS.ACCENT,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.GRAY_MEDIUM,
    marginHorizontal: SPACING.lg,
  },
  drawerFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.DANGER,
  },
  logoutText: {
    color: COLORS.DANGER,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
});
