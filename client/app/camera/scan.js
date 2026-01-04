import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import api from "../utils/api";

export default function ScanCamera() {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  // Request permission if not granted
  if (!permission) {
    return <View style={{ flex: 1 }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const formData = new FormData();
      formData.append("mediaFile", {
        uri: photo.uri,
        name: "scan.jpg",
        type: "image/jpeg",
      });
      try {
        const res = await api.post("/api/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        router.push(`/result/${res.data.id}`);
      } catch (_e) {
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        enableTorch={false}
      />
      <View style={styles.overlay} />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "80%",
    height: "60%",
    borderWidth: 2,
    borderColor: "#00e676",
    borderRadius: 16,
    zIndex: 2,
  },
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
});
