import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraType } from "expo-camera"; // Import CameraType
import { useRouter } from "expo-router";
import api from "../utils/api";

const { width, height } = Dimensions.get("window");
const overlaySize = width * 0.8; // 80% of screen width

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<Camera | null>(null); // Type useRef with Camera
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });

        if (photo.uri) {
          await uploadImage(photo.uri);
        }
      } catch (error: any) {
        // Type error as any for now
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture.");
        setLoading(false);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    // Type uri
    const formData = new FormData();
    formData.append("mediaFile", {
      uri,
      name: `bill_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any); // Type assertion for File

    try {
      const response = await api.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Analysis Result:", response.data);
      router.replace({
        pathname: "/result/[id]",
        params: { id: "latest", data: JSON.stringify(response.data) },
      });
    } catch (error: any) {
      // Type error as any for now
      console.error("Error uploading image for analysis:", error);
      Alert.alert("Error", "Failed to upload bill for analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back} // Use CameraType
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedBox} />
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Capture Bill</Text>
            )}
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
  },
  focusedContainer: {
    flexDirection: "row",
    height: overlaySize, // Same height as width for a square
  },
  focusedBox: {
    width: overlaySize,
    height: overlaySize,
    borderColor: "rgba(255,255,255,0.7)",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 50,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CameraScreen;
