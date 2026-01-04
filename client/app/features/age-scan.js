import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import api from "../utils/api";
import SmartLoader from "../../components/SmartLoader";

export default function AgeScan() {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      setShowLoader(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        name: "appliance.jpg",
        type: "image/jpeg",
      });
      try {
        const res = await api.post("/api/appliance/detect", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        router.push("/features/inventory");
      } catch (e) {
        alert("Upload failed");
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={{ flex: 1 }} type={Camera.Back} />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Align Serial Number Sticker Here</Text>
      </View>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Capture</Text>
        )}
      </TouchableOpacity>
      {showLoader && <SmartLoader />}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "80%",
    height: "20%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  overlayText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  captureButton: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    marginLeft: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1976d2",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  buttonText: { color: "#fff", fontSize: 18 },
});
