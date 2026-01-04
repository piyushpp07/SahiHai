import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ExpoCamera from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import SmartLoader from "../../components/SmartLoader";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

const Camera = ExpoCamera.default || ExpoCamera.Camera;

export default function ScanTab() {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      setShowLoader(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
        });
        const formData = new FormData();
        formData.append("file", {
          uri: photo.uri,
          name: "appliance.jpg",
          type: "image/jpeg",
        });
        const res = await api.post("/api/appliance/detect", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLoading(false);
        setShowLoader(false);
        router.push({
          pathname: "/result/[id]",
          params: { id: res.data._id || "detected" },
        });
      } catch (_error) {
        setLoading(false);
        setShowLoader(false);
        Alert.alert("Error", "Failed to detect appliance. Please try again.");
      }
    }
  };

  if (cameraPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.ACCENT} />
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color={COLORS.DANGER} />
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <Text style={styles.permissionSubText}>
          Please enable camera access in settings to use this feature.
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            Alert.alert(
              "Camera Permission",
              "Please enable camera permission in your device settings."
            );
          }}
        >
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={styles.camera} type="back" ratio="16:9" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Scan Appliance</Text>
        <Text style={styles.headerSubtitle}>
          Position serial number sticker in frame
        </Text>
      </View>

      {/* Guide Overlay */}
      <View style={styles.guideContainer}>
        <View style={styles.guideBorder} />
        <Text style={styles.guideText}>Align here</Text>
      </View>

      {/* Bottom Controls */}
      <View style={[styles.bottomControls, SHADOWS.lg]}>
        <View style={styles.controlsContent}>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => {
              // Flash toggle can be added here
            }}
          >
            <Ionicons name="flash-off" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              loading && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.ACCENT} size={40} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => {
              // Gallery selection can be added here
            }}
          >
            <Ionicons name="image" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
        <Text style={styles.captureText}>
          {loading ? "Analyzing..." : "Tap to capture"}
        </Text>
      </View>

      {showLoader && <SmartLoader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG_SECONDARY,
    paddingHorizontal: SPACING.lg,
  },
  permissionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  permissionSubText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  settingsButton: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  settingsButtonText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
  },
  camera: {
    flex: 1,
  },
  topHeader: {
    position: "absolute",
    top: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    color: COLORS.WHITE,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.WHITE,
    marginTop: SPACING.xs,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  guideContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -80 }, { translateY: -80 }],
    width: 160,
    height: 160,
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  guideBorder: {
    width: 160,
    height: 160,
    borderWidth: 3,
    borderColor: `${COLORS.ACCENT}80`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: "rgba(25, 118, 210, 0.05)",
  },
  guideText: {
    position: "absolute",
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.sm,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${COLORS.BLACK}E8`,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  controlsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  flashButton: {
    padding: SPACING.md,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.ACCENT,
  },
  galleryButton: {
    padding: SPACING.md,
  },
  captureText: {
    color: COLORS.WHITE,
    textAlign: "center",
    fontSize: FONT_SIZES.sm,
    fontWeight: "500",
  },
});
