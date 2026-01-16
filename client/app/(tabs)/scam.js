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
    } catch (error) {
      console.error("Scam check error:", error);
      Alert.alert("Error", "Failed to analyze screenshot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "#8B0000"; // Dark red
      case "high":
        return COLORS.DANGER;
      case "medium":
        return COLORS.WARNING;
      case "low":
        return "#FFB366";
      case "safe":
        return COLORS.SUCCESS;
      default:
        return COLORS.INFO;
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
      case "high":
        return "alert-circle";
      case "medium":
        return "warning";
      case "low":
        return "shield-checkmark";
      case "safe":
        return "checkmark-circle";
      default:
        return "information-circle";
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛡️ Scam Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Upload screenshots to detect Indian scam patterns instantly
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

        {/* Enhanced Results Section */}
        {result && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Analysis Results</Text>

            {/* Scam Alert Banner */}
            {result.isScam && (
              <View style={[styles.scamAlertBanner, SHADOWS.md]}>
                <Ionicons name="warning" size={24} color={COLORS.WHITE} />
                <Text style={styles.scamAlertText}>⚠️ SCAM DETECTED!</Text>
              </View>
            )}

            {/* Risk Level Card */}
            <View
              style={[
                styles.resultCard,
                {
                  borderLeftWidth: 5,
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
                    size={24}
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
                    {result.riskLevel?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {result.confidence && (
                <View style={styles.confidenceBar}>
                  <View style={styles.confidenceRow}>
                    <Text style={styles.resultKey}>AI Confidence</Text>
                    <Text style={styles.confidenceValue}>
                      {result.confidence}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${result.confidence}%`,
                          backgroundColor: getRiskColor(result.riskLevel),
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              {result.scamType && result.scamType !== "None" && (
                <View style={styles.scamTypeBadge}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={COLORS.DANGER}
                  />
                  <Text style={styles.scamTypeText}>
                    Type: {result.scamType}
                  </Text>
                </View>
              )}
            </View>

            {/* Summary Section */}
            {result.summary && (
              <View style={[styles.summaryCard, SHADOWS.md]}>
                <View style={styles.summaryHeader}>
                  <Ionicons
                    name="document-text"
                    size={20}
                    color={COLORS.ACCENT}
                  />
                  <Text style={styles.summaryTitle}>Summary</Text>
                </View>
                <Text style={styles.summaryText}>{result.summary}</Text>
              </View>
            )}

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <View style={[styles.findingsContainer, SHADOWS.sm]}>
                <View style={styles.findingsHeader}>
                  <Ionicons name="flag" size={20} color={COLORS.DANGER} />
                  <Text style={styles.findingsTitle}>🚩 Red Flags Detected</Text>
                </View>
                {result.redFlags.map((flag, index) => (
                  <View key={index} style={styles.findingItem}>
                    <View
                      style={[styles.findingDot, { backgroundColor: COLORS.DANGER }]}
                    />
                    <Text style={styles.findingText}>{flag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Legitimate Elements */}
            {result.legitimateElements && result.legitimateElements.length > 0 && (
              <View style={[styles.legitimateContainer, SHADOWS.sm]}>
                <View style={styles.legitimateHeader}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.SUCCESS}
                  />
                  <Text style={styles.legitimateTitle}>✓ Legitimate Elements</Text>
                </View>
                {result.legitimateElements.map((element, index) => (
                  <View key={index} style={styles.legitimateItem}>
                    <View
                      style={[
                        styles.findingDot,
                        { backgroundColor: COLORS.SUCCESS },
                      ]}
                    />
                    <Text style={styles.legitimateText}>{element}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recommendation Box */}
            {result.recommendation && (
              <View
                style={[
                  styles.recommendationBox,
                  {
                    backgroundColor: result.isScam
                      ? "rgba(220, 38, 38, 0.1)"
                      : "rgba(34, 197, 94, 0.1)",
                    borderColor: result.isScam ? COLORS.DANGER : COLORS.SUCCESS,
                  },
                  SHADOWS.sm,
                ]}
              >
                <View style={styles.recommendationHeader}>
                  <Ionicons
                    name={result.isScam ? "shield-half" : "shield-checkmark"}
                    size={28}
                    color={result.isScam ? COLORS.DANGER : COLORS.SUCCESS}
                  />
                  <Text
                    style={[
                      styles.recommendationTitle,
                      { color: result.isScam ? COLORS.DANGER : COLORS.SUCCESS },
                    ]}
                  >
                    {result.isScam ? "Action Required" : "Recommendation"}
                  </Text>
                </View>
                <Text style={styles.recommendationText}>
                  {result.recommendation}
                </Text>
              </View>
            )}

            {/* Report To Section */}
            {result.reportTo && result.reportTo.length > 0 && (
              <View style={[styles.reportCard, SHADOWS.sm]}>
                <View style={styles.reportHeader}>
                  <Ionicons name="megaphone" size={20} color={COLORS.INFO} />
                  <Text style={styles.reportTitle}>📢 Report This Scam</Text>
                </View>
                {result.reportTo.map((contact, index) => (
                  <View key={index} style={styles.reportItem}>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={16}
                      color={COLORS.INFO}
                    />
                    <Text style={styles.reportText}>{contact}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Analyze Another Button */}
            <TouchableOpacity
              style={[styles.analyzeAnotherButton, SHADOWS.md]}
              onPress={() => {
                setImage(null);
                setResult(null);
              }}
            >
              <Ionicons name="refresh" size={20} color={COLORS.WHITE} />
              <Text style={styles.analyzeAnotherText}>
                Analyze Another Screenshot
              </Text>
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
  // Scam Alert Banner
  scamAlertBanner: {
    backgroundColor: COLORS.DANGER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  scamAlertText: {
    color: COLORS.WHITE,
    fontWeight: "700",
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.sm,
  },
  // Result Card
  resultCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  riskBadge: {
    width: 56,
    height: 56,
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
  resultKey: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
  },
  // Confidence Bar
  confidenceBar: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_MEDIUM,
  },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  confidenceValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: BORDER_RADIUS.sm,
  },
  // Scam Type Badge
  scamTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderRadius: BORDER_RADIUS.md,
    alignSelf: "flex-start",
  },
  scamTypeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.DANGER,
    marginLeft: SPACING.sm,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.sm,
  },
  summaryText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  // Findings Container
  findingsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  findingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  findingsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.DANGER,
    marginLeft: SPACING.sm,
  },
  findingItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  findingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: SPACING.md,
  },
  findingText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  // Legitimate Elements
  legitimateContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  legitimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  legitimateTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.SUCCESS,
    marginLeft: SPACING.sm,
  },
  legitimateItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  legitimateText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  // Recommendation Box
  recommendationBox: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    marginBottom: SPACING.lg,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  recommendationTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    marginLeft: SPACING.sm,
  },
  recommendationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  // Report Card
  reportCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  reportTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.INFO,
    marginLeft: SPACING.sm,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  reportText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.md,
    lineHeight: 20,
  },
  // Analyze Another Button
  analyzeAnotherButton: {
    backgroundColor: COLORS.ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  analyzeAnotherText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});
