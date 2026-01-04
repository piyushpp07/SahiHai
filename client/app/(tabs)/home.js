import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import { useRouter } from "expo-router";
import ModernHeader from "../components/ModernHeader";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function HomeTab() {
  const [recentScans, setRecentScans] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, but provide fallback data
      try {
        const res = await api.get("/api/scans");
        setRecentScans(res.data?.scans || []);
        setTotalSaved(res.data?.totalSaved || 0);
      } catch (_apiError) {
        // If API fails, use empty/default state
        setRecentScans([]);
        setTotalSaved(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: "scan",
      icon: "scan-circle",
      title: "Scan Appliance",
      description: "Detect appliance age and model",
      color: COLORS.ACCENT,
      route: "/scan",
    },
    {
      id: "inventory",
      icon: "cube",
      title: "Inventory",
      description: "Manage your appliances",
      color: COLORS.SUCCESS,
      route: "/inventory",
    },
    {
      id: "scam",
      icon: "alert-circle",
      title: "Scam Scanner",
      description: "Check for scam indicators",
      color: COLORS.DANGER,
      route: "/scam",
    },
    {
      id: "sarkari",
      icon: "document-text",
      title: "Sarkari Saathi",
      description: "Draft official letters",
      color: COLORS.WARNING,
      route: "/sarkari",
    },
  ];

  const renderFeatureCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.featureCard, SHADOWS.md]}
      onPress={() => router.push(item.route)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.featureIconContainer,
          { backgroundColor: `${item.color}15` },
        ]}
      >
        <Ionicons name={item.icon} size={32} color={item.color} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_LIGHT} />
    </TouchableOpacity>
  );

  const renderRecentScan = ({ item }) => (
    <TouchableOpacity
      style={[styles.scanCard, SHADOWS.sm]}
      onPress={() => router.push(`/result/${item._id}`)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.scanIcon,
          {
            backgroundColor:
              item.type === "image"
                ? `${COLORS.ACCENT}15`
                : `${COLORS.SUCCESS}15`,
          },
        ]}
      >
        <Ionicons
          name={item.type === "image" ? "document" : "mic"}
          size={24}
          color={item.type === "image" ? COLORS.ACCENT : COLORS.SUCCESS}
        />
      </View>
      <View style={styles.scanInfo}>
        <Text style={styles.scanTitle}>{item.title || "Scan Result"}</Text>
        <Text style={styles.scanTime}>Just now</Text>
      </View>
      <View style={styles.savingsBadge}>
        <Text style={styles.savingsText}>₹{item.savings || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.ACCENT} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ModernHeader title="SahiHai" subtitle="Your digital rights assistant" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View style={[styles.statsCard, SHADOWS.lg]}>
          <View style={styles.statsContent}>
            <Ionicons name="wallet" size={32} color={COLORS.ACCENT} />
            <View style={styles.statsTextContainer}>
              <Text style={styles.statsLabel}>Total Savings</Text>
              <Text style={styles.statsValue}>₹{totalSaved}</Text>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <FlatList
            data={features}
            renderItem={renderFeatureCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: SPACING.md }} />
            )}
          />
        </View>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={fetchData}>
                <Ionicons name="refresh" size={20} color={COLORS.ACCENT} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentScans}
              renderItem={renderRecentScan}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={{ height: SPACING.md }} />
              )}
            />
          </View>
        )}

        {/* Empty State */}
        {recentScans.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="time-outline"
              size={64}
              color={COLORS.GRAY_MEDIUM}
            />
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubText}>
              Start by scanning an appliance or checking for scams
            </Text>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={[styles.tipCard, SHADOWS.sm]}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb" size={24} color={COLORS.WARNING} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Know Your Rights</Text>
              <Text style={styles.tipText}>
                Use Sarkari Saathi to draft official complaints to government
                departments.
              </Text>
            </View>
          </View>
          <View style={[styles.tipCard, SHADOWS.sm]}>
            <View style={styles.tipIconContainer}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={COLORS.SUCCESS}
              />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Protected</Text>
              <Text style={styles.tipText}>
                Always verify before clicking links or sharing personal
                information online.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG_SECONDARY,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greetingText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  greetingSubText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  statsCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  statsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsTextContainer: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  statsLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  statsValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: "700",
    color: COLORS.ACCENT,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  featureCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  scanCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  scanInfo: {
    flex: 1,
  },
  scanTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  scanTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_LIGHT,
  },
  savingsBadge: {
    backgroundColor: `${COLORS.SUCCESS}20`,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  savingsText: {
    color: COLORS.SUCCESS,
    fontWeight: "600",
    fontSize: FONT_SIZES.sm,
  },
  tipCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  tipIconContainer: {
    marginRight: SPACING.md,
    marginTop: SPACING.xs,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.lg,
  },
  emptySubText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.sm,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
});
