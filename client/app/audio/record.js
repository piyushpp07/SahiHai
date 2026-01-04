import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import api from "../utils/api";

export default function AudioRecord() {
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      alert("Failed to start recording");
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append("mediaFile", {
        uri,
        name: "audio.m4a",
        type: "audio/m4a",
      });
      const res = await api.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push(`/result/${res.data.id}`);
    } catch (e) {
      alert("Upload failed");
    } finally {
      setLoading(false);
      setRecording(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={recording ? stopRecording : startRecording}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {recording ? "Stop" : "Hold to Record"}
          </Text>
        )}
      </TouchableOpacity>
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
  recordButton: {
    backgroundColor: "#d32f2f",
    padding: 32,
    borderRadius: 32,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 20 },
});
