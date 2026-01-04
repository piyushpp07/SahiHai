// Only import LottieView on native

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const texts = [
  "Analyzing...",
  "Checking Market Rates...",
  "Generating Report...",
];

export default function SmartLoader() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1976d2" style={{ margin: 40 }} />
      <Text style={styles.text}>{texts[index]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: { fontSize: 18, marginTop: 20, color: "#333" },
});
