import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

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

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: colors.BG_SECONDARY },
        ]}
      >
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({
    icon,
    label,
    value,
    onPress,
    showArrow = true,
    rightComponent,
  }) => (
    <TouchableOpacity
      style={[styles.settingsItem, { borderBottomColor: colors.BORDER }]}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={24} color={colors.ACCENT} />
        <Text
          style={[styles.settingsItemLabel, { color: colors.TEXT_PRIMARY }]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && (
          <Text
            style={[styles.settingsItemValue, { color: colors.TEXT_SECONDARY }]}
          >
            {value}
          </Text>
        )}
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.TEXT_TERTIARY}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View
          style={[
            styles.profileHeader,
            { backgroundColor: colors.BG_SECONDARY },
          ]}
        >
          <View
            style={[styles.avatarCircle, { backgroundColor: colors.ACCENT }]}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: colors.TEXT_PRIMARY }]}>
            {user?.name || "User"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.TEXT_SECONDARY }]}>
            {user?.email || "user@sahihai.app"}
          </Text>
          <TouchableOpacity
            style={[styles.editProfileButton, { borderColor: colors.ACCENT }]}
            onPress={() =>
              Alert.alert("Edit Profile", "Profile editing coming soon!")
            }
          >
            <Text style={[styles.editProfileText, { color: colors.ACCENT }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <SettingsSection title="APPEARANCE">
          <SettingsItem
            icon="moon-outline"
            label="Dark Mode"
            showArrow={false}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
                thumbColor={isDark ? colors.WHITE : colors.WHITE}
              />
            }
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="NOTIFICATIONS">
          <SettingsItem
            icon="notifications-outline"
            label="Push Notifications"
            showArrow={false}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.BORDER, true: colors.ACCENT }}
                thumbColor={notifications ? colors.WHITE : colors.WHITE}
              />
            }
          />
          <SettingsItem
            icon="mail-outline"
            label="Email Notifications"
            onPress={() => Alert.alert("Email Notifications", "Coming soon!")}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="ACCOUNT">
          <SettingsItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => Alert.alert("Change Password", "Coming soon!")}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            onPress={() => Alert.alert("Privacy & Security", "Coming soon!")}
          />
          <SettingsItem
            icon="card-outline"
            label="Payment Methods"
            onPress={() => Alert.alert("Payment Methods", "Coming soon!")}
          />
        </SettingsSection>

        {/* App Info */}
        <SettingsSection title="APP INFO">
          <SettingsItem
            icon="information-circle-outline"
            label="About SahiHai"
            value="v1.0.0"
            onPress={() =>
              Alert.alert(
                "About",
                "SahiHai - Protect Your Rights, Detect Frauds\nVersion 1.0.0"
              )
            }
          />
          <SettingsItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Alert.alert("Terms of Service", "Coming soon!")}
          />
          <SettingsItem
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => Alert.alert("Privacy Policy", "Coming soon!")}
          />
          <SettingsItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() =>
              Alert.alert("Help & Support", "Email: support@sahihai.app")
            }
          />
        </SettingsSection>

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
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.DANGER} />
          <Text style={[styles.logoutButtonText, { color: colors.DANGER }]}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 24,
  },
  sectionContent: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
  settingsItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingsItemValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    height: 20,
  },
});
