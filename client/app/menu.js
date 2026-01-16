import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();

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
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      route: "/(tabs)/home",
      color: colors.ACCENT,
    },
    {
      id: "scan",
      label: "Scan Appliance",
      icon: "scan-circle",
      route: "/(tabs)/scan",
      color: colors.ACCENT,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "cube",
      route: "/(tabs)/inventory",
      color: colors.ACCENT,
    },
    {
      id: "scam",
      label: "Scam Scanner",
      icon: "alert-circle",
      route: "/(tabs)/scam",
      color: colors.DANGER,
    },
    {
      id: "sarkari",
      label: "Sarkari Saathi",
      icon: "document-text",
      route: "/(tabs)/sarkari",
      color: colors.WARNING,
    },
    {
      id: "chat",
      label: "Chat Assistant",
      icon: "chatbubble-ellipses",
      route: "/(tabs)/chat",
      color: colors.ACCENT,
    },
  ];

  const settingsItems = [
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      route: "/(tabs)/settings",
    },
    {
      id: "theme",
      label: isDark ? "Light Mode" : "Dark Mode",
      icon: isDark ? "sunny" : "moon",
      action: toggleTheme,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: "help-circle",
      action: () => Alert.alert("Help & Support", "Email: support@sahihai.app"),
    },
    {
      id: "about",
      label: "About",
      icon: "information-circle",
      action: () =>
        Alert.alert(
          "About",
          "SahiHai v1.0.0\nProtect Your Rights, Detect Frauds"
        ),
    },
  ];

  const MenuItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.BG_SECONDARY }]}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.route) {
          router.push(item.route);
        }
      }}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.menuItemIcon,
          { backgroundColor: `${item.color || colors.TEXT_SECONDARY}15` },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={24}
          color={item.color || colors.TEXT_SECONDARY}
        />
      </View>
      <Text style={[styles.menuItemText, { color: colors.TEXT_PRIMARY }]}>
        {item.label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.TEXT_TERTIARY} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}
      edges={["top"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.ACCENT }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.WHITE} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.WHITE }]}>Menu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View
          style={[styles.profileCard, { backgroundColor: colors.BG_SECONDARY }]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.ACCENT }]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.TEXT_PRIMARY }]}>
              {user?.name || "User"}
            </Text>
            <Text
              style={[styles.profileEmail, { color: colors.TEXT_SECONDARY }]}
            >
              {user?.email || "user@sahihai.app"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color={colors.ACCENT} />
          </TouchableOpacity>
        </View>

        {/* Main Menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_TERTIARY }]}>
            FEATURES
          </Text>
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_TERTIARY }]}>
            SETTINGS
          </Text>
          {settingsItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.BG_SECONDARY,
              borderColor: colors.DANGER,
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.DANGER} />
          <Text style={[styles.logoutText, { color: colors.DANGER }]}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    height: 40,
  },
});
