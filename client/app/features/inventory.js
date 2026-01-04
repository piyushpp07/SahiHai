import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Inventory() {
  const [selectedTip, setSelectedTip] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appliances</Text>
      <View style={styles.comingSoonBox}>
        <Text style={styles.comingSoonText}>🔜 Coming Soon</Text>
        <Text style={styles.comingSoonSubtext}>
          Appliance tracking and maintenance tips will be available soon!
        </Text>
      </View>
      {selectedTip && (
        <View style={styles.tipBox}>
          <Text style={{ fontWeight: "bold" }}>Maintenance Tip:</Text>
          <Text>{selectedTip}</Text>
          <TouchableOpacity
            onPress={() => setSelectedTip(null)}
            style={styles.closeTip}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  comingSoonBox: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  comingSoonText: { fontSize: 24, marginBottom: 10 },
  comingSoonSubtext: { fontSize: 14, color: "#666", textAlign: "center" },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontWeight: "bold", fontSize: 16 },
  badge: { alignSelf: "flex-start", padding: 6, borderRadius: 6, marginTop: 8 },
  tipBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  closeTip: {
    backgroundColor: "#1976d2",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
});
