import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import api from "./utils/api";
import { useRouter } from "expo-router";

export default function Home() {
  const [recentScans, setRecentScans] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const router = useRouter();

  useEffect(() => {
    api.get("/scans").then((res) => {
      setRecentScans(res.data.scans || []);
      setTotalSaved(res.data.totalSaved || 0);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardShadow}>
        <Text style={styles.cardTitle}>Total Money Saved</Text>
        <Text style={styles.cardValue}>₹{totalSaved}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: "#1976d2" }]}
          onPress={() => router.push("/camera/scan")}
        >
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>Scan Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: "#00b894" }]}
          onPress={() => router.push("/audio/record")}
        >
          <Text style={styles.buttonIcon}>🎤</Text>
          <Text style={styles.buttonText}>Record Audio</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: "#6366f1" }]}
          onPress={() => router.push("/features/inventory")}
        >
          <Text style={styles.buttonIcon}>🧊</Text>
          <Text style={styles.buttonText}>Check Appliance Age</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: "#fdcb6e" }]}
          onPress={() => router.push("/sarkari")}
        >
          <Text style={styles.buttonIcon}>🏛️</Text>
          <Text style={styles.buttonText}>Draft Legal Letter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: "#e17055" }]}
          onPress={() => router.push("/scam")}
        >
          <Text style={styles.buttonIcon}>🕵️</Text>
          <Text style={styles.buttonText}>Check for Scam</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Recent Scans</Text>
      <FlatList
        data={recentScans}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/result/${item._id}`)}>
            <View style={styles.scanItemCard}>
              <Text style={styles.scanItemIcon}>
                {item.type === "image" ? "🧾" : "🎤"}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.scanItemTitle}>
                  {item.title || item._id}
                </Text>
                <Text style={styles.scanItemSubtitle}>
                  ₹{item.savings || 0} saved
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f6f8fa" },
  cardShadow: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    color: "#636e72",
    fontWeight: "600",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1976d2",
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  bigButton: {
    flex: 1,
    margin: 8,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonIcon: { fontSize: 22, marginRight: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 14,
    color: "#222",
    fontWeight: "bold",
  },
  scanItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  scanItemIcon: { fontSize: 22, marginRight: 12 },
  scanItemTitle: { fontWeight: "bold", fontSize: 16, color: "#1976d2" },
  scanItemSubtitle: { color: "#636e72", fontSize: 14 },
});
