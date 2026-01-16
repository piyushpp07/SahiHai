import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function InventoryTab() {
  const [appliances, setAppliances] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAppliances();
  }, []);

  const fetchAppliances = async () => {
    try {
      setLoading(true);
      // TODO: Implement /api/appliance/list endpoint in backend
      // For now, show empty state
      setAppliances([]);
      // const res = await api.get("/api/appliance/list");
      // setAppliances(res.data);
    } catch (error) {
      console.error("Failed to fetch appliances:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppliances();
    setRefreshing(false);
  };

  const renderAppliance = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, SHADOWS.md]}
      onPress={() => setSelectedTip(item.maintenance_tip)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="cube" size={24} color={COLORS.ACCENT} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.applanceName}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.serial}>Serial: {item.serial}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.ageContainer}>
          <Ionicons name="calendar" size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.ageText}>
            {item.age_years !== null
              ? `${item.age_years} Years Old`
              : "Age Unknown"}
          </Text>
        </View>

        <View
          style={[
            styles.warrantyBadge,
            {
              backgroundColor: item.is_warranty_likely_expired
                ? COLORS.DANGER
                : COLORS.SUCCESS,
            },
          ]}
        >
          <Ionicons
            name={
              item.is_warranty_likely_expired
                ? "close-circle"
                : "checkmark-circle"
            }
            size={16}
            color={COLORS.WHITE}
            style={{ marginRight: SPACING.sm }}
          />
          <Text style={styles.warrantyText}>
            {item.is_warranty_likely_expired
              ? "Warranty Expired"
              : "Under Warranty"}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.tapText}>Tap for maintenance tips →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.ACCENT} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Appliances</Text>
            <Text style={styles.headerSubtitle}>
              {appliances.length} appliances registered
            </Text>
          </View>

          {appliances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cube-outline"
                size={64}
                color={COLORS.GRAY_MEDIUM}
              />
              <Text style={styles.emptyText}>No appliances registered yet</Text>
              <Text style={styles.emptySubText}>
                Add appliances to track their age and warranty
              </Text>
            </View>
          ) : (
            <FlatList
              data={appliances}
              keyExtractor={(item) => item._id}
              renderItem={renderAppliance}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: SPACING.lg,
                paddingBottom: SPACING.lg,
              }}
              ItemSeparatorComponent={() => (
                <View style={{ height: SPACING.md }} />
              )}
            />
          )}
        </ScrollView>
      </View>

      {selectedTip && (
        <View style={[styles.tipModalOverlay, SHADOWS.lg]}>
          <View style={styles.tipModal}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={24} color={COLORS.WARNING} />
              <Text style={styles.tipTitle}>Maintenance Tip</Text>
              <TouchableOpacity
                onPress={() => setSelectedTip(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={styles.tipContent}>{selectedTip}</Text>
            <TouchableOpacity
              style={styles.tipCloseButton}
              onPress={() => setSelectedTip(null)}
            >
              <Text style={styles.tipCloseButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  centerContainer: {
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
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.ACCENT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  cardInfo: {
    flex: 1,
  },
  applanceName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  serial: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  ageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  ageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.sm,
  },
  warrantyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  warrantyText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.sm,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
    paddingTop: SPACING.md,
  },
  tapText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.ACCENT,
    fontWeight: "500",
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
  },
  tipModalOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    paddingBottom: SPACING.lg,
  },
  tipModal: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    justifyContent: "space-between",
  },
  tipTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginLeft: SPACING.md,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  tipContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  tipCloseButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  tipCloseButtonText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
  },
});
