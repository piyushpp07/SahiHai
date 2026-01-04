import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import api from "../utils/api";

export default function Inventory() {
  const [appliances, setAppliances] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    api.get("/api/appliance/list").then((res) => {
      setAppliances(res.data);
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedTip(item.maintenance_tip)}
    >
      <Text style={styles.name}>
        {item.brand} {item.model}
      </Text>
      <Text>Serial: {item.serial}</Text>
      <Text>
        Age: {item.age_years !== null ? `${item.age_years} Years` : "Unknown"}
      </Text>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: item.is_warranty_likely_expired
              ? "#d32f2f"
              : "#388e3c",
          },
        ]}
      >
        <Text style={{ color: "#fff" }}>
          {item.is_warranty_likely_expired ? "Expired" : "Under Warranty"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appliances</Text>
      <FlatList
        data={appliances}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
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
