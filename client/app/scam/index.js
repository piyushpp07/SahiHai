import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../utils/api";

export default function ScamScanner() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const checkScam = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "screenshot.jpg",
      type: "image/jpeg",
    });
    try {
      const res = await api.post("/api/scam/check", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (e) {
      Alert.alert("Error", "Failed to analyze screenshot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scam Scanner</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>Upload Screenshot</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity
        style={styles.checkButton}
        onPress={checkScam}
        disabled={loading || !image}
      >
        <Text style={{ color: "#fff" }}>
          {loading ? "Checking..." : "Check for Scam"}
        </Text>
      </TouchableOpacity>
      {result && (
        <View style={styles.resultBox}>
          <Text style={{ fontWeight: "bold" }}>
            Risk Score:{" "}
            <Text
              style={{
                color:
                  result.riskLevel === "High"
                    ? "red"
                    : result.riskLevel === "Medium"
                    ? "orange"
                    : "green",
              }}
            >
              {result.riskLevel}
            </Text>
          </Text>
          <Text>
            Verdict: {result.verdict || (result.isScam ? "Scam" : "Safe")}
          </Text>
          <Text>
            Advice:{" "}
            {result.advice ||
              (result.isScam
                ? "Block this number immediately."
                : "No action needed.")}
          </Text>
          <Text>Reason: {result.reason}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  uploadButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
  checkButton: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  resultBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
});
