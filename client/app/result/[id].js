import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import api from "../utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import SmartLoader from "../../components/SmartLoader";

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Implement /api/result/:id endpoint or use different result handling
    // For now, just return mock data based on scan from previous screen
    setResult({
      lootMeter: 45,
      flaggedItems: [],
      totalSaved: 0,
    });
    setLoading(false);
    // api.get(`/api/result/${id}`).then((res) => {
    //   setResult(res.data);
    //   setLoading(false);
    // });
  }, [id]);

  if (loading) return <SmartLoader />;
  if (!result) return <Text>Result not found</Text>;

  const shareReport = async () => {
    await Share.share({
      message: `Loot Meter: ${
        result.lootMeter
      }%\nFlagged Items: ${result.flaggedItems
        .map((i) => i.name)
        .join(", ")}\nCheck your bill with SahiHai!`,
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
      </View>
      <Text style={styles.sectionTitle}>Flagged Items</Text>
      {result.flaggedItems.map((item) => (
        <View key={item.name} style={styles.card}>
          <Text>
            {item.name} - ₹{item.price} (Overcharged:{" "}
            {item.overcharged ? "Yes" : "No"})
          </Text>
        </View>
      ))}
      <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
        <Text style={{ color: "#fff" }}>Share Loot Report on WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.push("/components/AssistantModal")}
      >
        <Text style={{ color: "#fff" }}>Chat with Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  lootMeterContainer: { alignItems: "center", marginBottom: 20 },
  lootMeterLabel: { fontSize: 18, color: "#333" },
  lootMeterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  lootMeterValue: { fontSize: 32, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, marginVertical: 10, color: "#555" },
  card: {
    backgroundColor: "#ffe0e0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: "#25d366",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  chatButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
});
