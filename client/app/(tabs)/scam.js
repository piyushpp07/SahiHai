import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import ModernHeader from "../components/ModernHeader";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function ScamTab() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 3],
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      quality: 1,
      aspect: [4, 3],
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  };

  const checkScam = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or take a screenshot first.");
      return;
    }

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
    } catch (_error) {
      Alert.alert("Error", "Failed to analyze screenshot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return COLORS.DANGER;
      case "medium":
        return COLORS.WARNING;
      case "low":
        return COLORS.SUCCESS;
      default:
        return COLORS.INFO;
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "alert-circle";
      case "medium":
        return "warning";
      case "low":
        return "checkmark-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <View style={styles.wrapper}>
      <ModernHeader title="Scam Scanner" subtitle="Check for scam indicators" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scam Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Upload screenshots to check for scam indicators
          </Text>
        </View>

        {/* Upload Section */}
        <View style={styles.section}>
          <View style={[styles.uploadCard, SHADOWS.md]}>
            <Ionicons
              name="image-outline"
              size={48}
              color={COLORS.ACCENT}
              style={{ marginBottom: SPACING.md }}
            />
            <Text style={styles.uploadTitle}>Upload Screenshot</Text>
            <Text style={styles.uploadSubtitle}>
              Select or take a photo to analyze
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.uploadButton, { marginBottom: SPACING.md }]}
                onPress={pickImage}
              >
                <Ionicons name="images" size={18} color={COLORS.WHITE} />
                <Text style={styles.buttonText}>From Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Ionicons name="camera" size={18} color={COLORS.WHITE} />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Image Preview */}
        {image && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Image</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setImage(null);
                setResult(null);
              }}
            >
              <Ionicons name="trash" size={18} color={COLORS.DANGER} />
              <Text style={styles.clearButtonText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Button */}
        {image && !result && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                loading && styles.analyzeButtonDisabled,
                SHADOWS.md,
              ]}
              onPress={checkScam}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <>
                  <Ionicons name="scan" size={20} color={COLORS.WHITE} />
                  <Text style={styles.analyzeButtonText}>
                    Analyze Screenshot
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>

            {/* Risk Level Card */}
            <View
              style={[
                styles.resultCard,
                {
                  borderLeftColor: getRiskColor(result.riskLevel),
                },
                SHADOWS.md,
              ]}
            >
              <View style={styles.resultHeader}>
                <View
                  style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor(result.riskLevel) },
                  ]}
                >
                  <Ionicons
                    name={getRiskIcon(result.riskLevel)}
                    size={20}
                    color={COLORS.WHITE}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.resultLabel}>Risk Level</Text>
                  <Text
                    style={[
                      styles.riskText,
                      { color: getRiskColor(result.riskLevel) },
                    ]}
                  >
                    {result.riskLevel}
                  </Text>
                </View>
              </View>

              {result.confidence && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultKey}>Confidence:</Text>
                  <Text style={styles.resultValue}>{result.confidence}%</Text>
                </View>
              )}
            </View>

            {/* Findings */}
            {result.findings && result.findings.length > 0 && (
              <View style={styles.findingsContainer}>
                <Text style={styles.findingsTitle}>Scam Indicators Found:</Text>
                {result.findings.map((finding, index) => (
                  <View key={index} style={styles.findingItem}>
                    <View style={styles.findingDot} />
                    <Text style={styles.findingText}>{finding}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendation */}
            {result.recommendation && (
              <View
                style={[
                  styles.recommendationBox,
                  {
                    borderColor:
                      result.riskLevel?.toLowerCase() === "high"
                        ? COLORS.DANGER
                        : COLORS.SUCCESS,
                  },
                ]}
              >
                <Ionicons
                  name={
                    result.riskLevel?.toLowerCase() === "high"
                      ? "alert-circle"
                      : "checkmark-circle"
                  }
                  size={24}
                  color={
                    result.riskLevel?.toLowerCase() === "high"
                      ? COLORS.DANGER
                      : COLORS.SUCCESS
                  }
                />
                <Text style={styles.recommendationText}>
                  {result.recommendation}
                </Text>
              </View>
            )}

            {/* Analyze Another Button */}
            <TouchableOpacity
              style={styles.analyzeAnotherButton}
              onPress={() => {
                setImage(null);
                setResult(null);
              }}
            >
              <Ionicons name="refresh" size={18} color={COLORS.ACCENT} />
              <Text style={styles.analyzeAnotherText}>Analyze Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!image && !result && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={64}
              color={COLORS.ACCENT}
            />
            <Text style={styles.emptyText}>No Screenshot Uploaded</Text>
            <Text style={styles.emptySubText}>
              Start by uploading or taking a screenshot to check for scams
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_SECONDARY,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  uploadCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  uploadSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
  },
  uploadButton: {
    backgroundColor: COLORS.ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.DANGER,
  },
  clearButtonText: {
    color: COLORS.DANGER,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  analyzeButton: {
    backgroundColor: COLORS.ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    marginBottom: SPACING.lg,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  riskBadge: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },
  riskText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
  },
  resultKey: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
  },
  resultValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  findingsContainer: {
    marginBottom: SPACING.lg,
  },
  findingsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.DANGER,
    marginBottom: SPACING.md,
  },
  findingItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  findingDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.DANGER,
    marginTop: 6,
    marginRight: SPACING.md,
  },
  findingText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  recommendationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${COLORS.BG_SECONDARY}80`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
  },
  recommendationText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.md,
    lineHeight: 20,
  },
  analyzeAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
    marginBottom: SPACING.xxl,
  },
  analyzeAnotherText: {
    color: COLORS.ACCENT,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.lg,
  },
  emptySubText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.sm,
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
});
