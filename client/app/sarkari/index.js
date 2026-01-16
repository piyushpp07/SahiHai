import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import api from "../utils/api";

export default function SarkariSaathi() {
  const [recording, setRecording] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "complaint.m4a",
        type: "audio/m4a",
      });
      const res = await api.post("/api/sarkari/draft", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setComplaintText(res.data.letter);
    } catch (e) {
      Alert.alert("Error", "Failed to process audio.");
    } finally {
      setLoading(false);
      setRecording(null);
    }
  };

  const generatePDF = async () => {
    if (!complaintText) return;
    setLoading(true);
    try {
      const res = await api.post("/api/sarkari/generate-pdf", {
        letter: complaintText,
      });
      const { pdf: pdfBase64 } = res.data;

      const pdfPath = `${FileSystem.documentDirectory}complaint.pdf`;
      await FileSystem.writeAsStringAsync(pdfPath, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert(`Uh oh, sharing isn't available on your platform`);
        return;
      }

      await Sharing.shareAsync(pdfPath);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sarkari Saathi</Text>
      <TouchableOpacity
        style={styles.micButton}
        onPress={recording ? stopRecording : startRecording}
        disabled={loading}
      >
        <Text style={styles.micText}>
          {recording ? "Stop" : "Hold to Record"}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ margin: 20 }} />}
      {complaintText ? (
        <>
          <Text style={styles.letterLabel}>Drafted Letter:</Text>
          <View style={styles.letterBox}>
            <Text>{complaintText}</Text>
          </View>
          <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
            <Text style={{ color: "#fff" }}>Generate PDF</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  micButton: {
    backgroundColor: "#1976d2",
    padding: 24,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: 20,
  },
  micText: { color: "#fff", fontSize: 18 },
  letterLabel: { fontWeight: "bold", marginTop: 20 },
  letterBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  pdfButton: {
    backgroundColor: "#388e3c",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
});
