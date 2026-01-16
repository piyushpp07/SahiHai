import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function CustomDrawerContent(props) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      screen: "home",
    },
    {
      id: "scan",
      label: "Scan Appliance",
      icon: "scan-circle",
      screen: "scan",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "cube",
      screen: "inventory",
    },
    {
      id: "scam",
      label: "Scam Scanner",
      icon: "alert-circle",
      screen: "scam",
    },
    {
      id: "sarkari",
      label: "Sarkari Saathi",
      icon: "document-text",
      screen: "sarkari",
    },
    {
      id: "chat",
      label: "Chat Assistant",
      icon: "chatbubble-ellipses",
      screen: "chat",
    },
  ];

  const otherItems = [
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      screen: "settings",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle",
      action: () => Alert.alert("Help & Support", "Email: support@sahihai.app"),
    },
    {
      id: "about",
      label: "About SahiHai",
      icon: "information-circle",
      action: () =>
        Alert.alert(
          "About",
          "SahiHai - Protect Your Rights, Detect Frauds\nVersion 1.0.0"
        ),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            props.navigation.closeDrawer();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToScreen = (screen) => {
    props.navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

  return (
    <SafeAreaView
      style={[styles.drawerContainer, { backgroundColor: colors.BG_PRIMARY }]}
    >
      <DrawerContentScrollView {...props} scrollEnabled={true}>
        {/* Profile Section */}
        <View
          style={[
            styles.profileSection,
            { backgroundColor: colors.BG_SECONDARY },
          ]}
        >
          <View
            style={[styles.avatarContainer, { backgroundColor: colors.ACCENT }]}
          >
            <Text style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.TEXT_PRIMARY }]}>
              {user?.name || "User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.TEXT_SECONDARY }]}>
              {user?.email || "user@sahihai.app"}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuLabel, { color: colors.TEXT_TERTIARY }]}>
            FEATURES
          </Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { backgroundColor: colors.BG_SECONDARY },
              ]}
              onPress={() => navigateToScreen(item.screen)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: `${colors.ACCENT}15` },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={colors.ACCENT} />
              </View>
              <Text
                style={[styles.menuItemText, { color: colors.TEXT_PRIMARY }]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.TEXT_TERTIARY}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuLabel, { color: colors.TEXT_TERTIARY }]}>
            MORE
          </Text>
          {otherItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { backgroundColor: colors.BG_SECONDARY },
              ]}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  navigateToScreen(item.screen);
                }
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: `${colors.TEXT_SECONDARY}15` },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={colors.TEXT_SECONDARY}
                />
              </View>
              <Text
                style={[styles.menuItemText, { color: colors.TEXT_PRIMARY }]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.TEXT_TERTIARY}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View
          style={[
            styles.statsSection,
            { backgroundColor: colors.BG_SECONDARY },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.ACCENT }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>
              Scans Done
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.BORDER }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.SUCCESS }]}>
              ₹5,240
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>
              Saved
            </Text>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View
        style={[
          styles.drawerFooter,
          {
            borderTopColor: colors.BORDER,
            backgroundColor: colors.BG_SECONDARY,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.DANGER }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={20} color={colors.DANGER} />
          <Text style={[styles.logoutText, { color: colors.DANGER }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  menuSection: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 12,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 12,
  },
});
