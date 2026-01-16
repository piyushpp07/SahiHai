import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import {
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/style";

export default function ModernHeader({ title, subtitle, showMenu = true }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const openDrawer = () => {
    // This assumes you have a drawer navigator. If not, replace with your menu logic.
    navigation.openDrawer?.(); 
  };

  return (
    <View style={[styles.header, SHADOWS.sm, { backgroundColor: colors.primary, paddingTop: SPACING.lg, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg }]}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          {showMenu && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={openDrawer}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={28} color={colors.white} />
            </TouchableOpacity>
          )}
          <View style={styles.titleText}>
            <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: `${colors.white}80` }]}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.white}
            />
            <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
              <Text style={[styles.badgeText, { color: colors.white }]}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // backgroundColor is now applied inline
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    position: "relative",
    padding: SPACING.sm,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: BORDER_RADIUS.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
  },
});
