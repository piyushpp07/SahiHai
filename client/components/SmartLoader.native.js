import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

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
      <LottieView
        source={require("../assets/lottie/scanner.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
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
