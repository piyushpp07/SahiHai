import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function ModernHeader({ title, subtitle, showMenu = true }) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer?.();
  };

  return (
    <View style={[styles.header, SHADOWS.sm]}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          {showMenu && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={openDrawer}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={28} color={COLORS.WHITE} />
            </TouchableOpacity>
          )}
          <View style={styles.titleText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.WHITE}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.ACCENT,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
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
    color: COLORS.WHITE,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: `${COLORS.WHITE}80`,
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
    backgroundColor: COLORS.DANGER,
    borderRadius: BORDER_RADIUS.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.xs,
    fontWeight: "700",
  },
});
