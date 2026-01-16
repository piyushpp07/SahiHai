import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import api from "../utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import SmartLoader from "../../components/SmartLoader";

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get data from navigation params
    const lootMeter = params.lootMeter ? parseInt(params.lootMeter) : 45;
    const summary = params.summary || "Analysis complete";
    const items = params.itemsJson ? JSON.parse(params.itemsJson) : [];
    const total = params.total ? parseFloat(params.total) : 0;

    setResult({
      lootMeter,
      summary,
      items,
      total,
      flaggedItems: items.filter((item) => item.price && item.price > 0),
    });
    setLoading(false);
  }, [params.lootMeter, params.summary, params.itemsJson, params.total]);

  if (loading) return <SmartLoader />;
  if (!result) return <Text>Result not found</Text>;

  const shareReport = async () => {
    const itemsList =
      result.items && result.items.length > 0
        ? result.items.map((i) => `${i.name}: ₹${i.price}`).join("\n")
        : "No items found";

    await Share.share({
      message:
        `🚨 SahiHai Loot Meter Report 🚨\n\n` +
        `Loot Score: ${result.lootMeter}%\n` +
        `${
          result.lootMeter > 70
            ? "⚠️ HIGH OVERCHARGE!"
            : result.lootMeter > 40
            ? "⚡ Moderate overcharge"
            : "✅ Fair pricing"
        }\n\n` +
        `Summary: ${result.summary}\n\n` +
        `Items:\n${itemsList}\n\n` +
        `Total: ₹${result.total}\n\n` +
        `Check your bills with SahiHai app!`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.lootMeterContainer}>
        <Text style={styles.lootMeterLabel}>Loot Meter</Text>
        <View
          style={[
            styles.lootMeterCircle,
            { borderColor: result.lootMeter > 50 ? "#d32f2f" : "#388e3c" },
          ]}
        >
          <Text style={styles.lootMeterValue}>{result.lootMeter}%</Text>
        </View>
        <Text style={styles.lootMeterStatus}>
          {result.lootMeter > 70
            ? "⚠️ High Overcharge Detected!"
            : result.lootMeter > 40
            ? "⚡ Moderate Overcharge"
            : "✅ Fair Pricing"}
        </Text>
      </View>

      {/* Summary */}
      {result.summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Analysis Summary</Text>
          <Text style={styles.summaryText}>{result.summary}</Text>
        </View>
      )}

      {/* Items List */}
      <Text style={styles.sectionTitle}>Bill Items</Text>
      {result.items && result.items.length > 0 ? (
        result.items.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.overcharge_percent !== undefined &&
                item.overcharge_percent > 0 && (
                  <View style={styles.overchargeTag}>
                    <Text style={styles.overchargeText}>
                      +{Math.round(item.overcharge_percent)}% overcharged
                    </Text>
                  </View>
                )}
              {item.fair_price && (
                <Text style={styles.fairPriceText}>
                  Fair price: ₹{item.fair_price}
                </Text>
              )}
            </View>
            <View style={styles.priceInfo}>
              <Text
                style={[
                  styles.itemPrice,
                  item.overcharge_percent > 0 && styles.overchargedPrice,
                ]}
              >
                ₹{item.price}
              </Text>
              {item.overcharge_percent > 0 && (
                <Text style={styles.extraCharge}>
                  +₹{Math.round(item.price - (item.fair_price || item.price))}
                </Text>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No items extracted from bill</Text>
      )}

      {/* Total */}
      {result.total > 0 && (
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{result.total}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
        <Text style={{ color: "#fff" }}>Share Loot Report on WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.push("/(tabs)/chat")}
      >
        <Text style={{ color: "#fff" }}>Chat with Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  lootMeterContainer: { alignItems: "center", marginBottom: 20 },
  lootMeterLabel: { fontSize: 18, color: "#333", marginBottom: 10 },
  lootMeterCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  lootMeterValue: { fontSize: 40, fontWeight: "bold", color: "#333" },
  lootMeterStatus: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1976d2",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff3e0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  overchargeTag: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  overchargeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d32f2f",
  },
  fairPriceText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6f00",
  },
  overchargedPrice: {
    color: "#d32f2f",
  },
  extraCharge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d32f2f",
    marginTop: 2,
  },
  noItemsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
  },
  totalCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#1976d2",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1976d2",
  },
  shareButton: {
    backgroundColor: "#25d366",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  chatButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
});
