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
import { useTheme } from "../context/ThemeContext";
import {
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/style";

export default function ScamTab() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library permission is required to select an image.');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
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
        return colors.error;
      case "medium":
        return colors.secondary;
      case "low":
        return "#FFB366";
      case "safe":
        return colors.success;
      default:
        return colors.textSecondary;
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
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            🛡️ Scam Scanner
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Upload screenshots to detect Indian scam patterns instantly
          </Text>
        </View>

        {/* Upload Section */}
        <View style={styles.section}>
          <View style={[styles.uploadCard, SHADOWS.md, { backgroundColor: colors.surface, shadowColor: colors.black }]}>
            <Ionicons
              name="image-outline"
              size={48}
              color={colors.primary}
              style={{ marginBottom: SPACING.md }}
            />
            <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>
              Upload Screenshot
            </Text>
            <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
              Select or take a photo to analyze
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: colors.primary, marginBottom: SPACING.md }]}
                onPress={pickImage}
              >
                <Ionicons name="images" size={18} color={colors.white} />
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  From Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: colors.primary }]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={18} color={colors.white} />
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Image Preview */}
        {image && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Selected Image
            </Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: colors.error }]}
              onPress={() => {
                setImage(null);
                setResult(null);
              }}
            >
              <Ionicons name="trash" size={18} color={colors.error} />
              <Text style={[styles.clearButtonText, { color: colors.error }]}>
                Remove Image
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Button */}
        {image && !result && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                { backgroundColor: colors.primary },
                loading && styles.analyzeButtonDisabled,
                SHADOWS.md,
              ]}
              onPress={checkScam}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="scan" size={20} color={colors.white} />
                  <Text style={[styles.analyzeButtonText, { color: colors.white }]}>
                    Analyze Screenshot
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Results Section */}
        {result && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Analysis Result
            </Text>
            <View style={[styles.resultCard, { backgroundColor: getRiskColor(result.riskLevel) }]}>
              <View style={styles.resultHeader}>
                <Ionicons name={getRiskIcon(result.riskLevel)} size={32} color={colors.white} />
                <Text style={[styles.riskLevel, { color: colors.white }]}>{result.riskLevel}</Text>
              </View>
              <Text style={[styles.summary, { color: colors.white }]}>{result.summary}</Text>
            </View>

            <View style={styles.detailsCard}>
              <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>Red Flags</Text>
              {result.redFlags.map((flag, index) => (
                <View key={index} style={styles.flag}>
                  <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
                  <Text style={[styles.flagText, { color: colors.textSecondary }]}>{flag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailsCard}>
              <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>Recommendation</Text>
              <Text style={[styles.recommendation, { color: colors.textSecondary }]}>{result.recommendation}</Text>
            </View>

             <View style={styles.detailsCard}>
              <Text style={[styles.detailsTitle, { color: colors.textPrimary }]}>Report To</Text>
              {result.reportTo.map((report, index) => (
                <View key={index} style={styles.flag}>
                  <Ionicons name="arrow-forward-circle-outline" size={18} color={colors.primary} />
                  <Text style={[styles.flagText, { color: colors.textSecondary }]}>{report}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!image && !result && (
          <View style={[styles.emptyContainer, { paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.lg }]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={64}
              color={colors.primary}
            />
            <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
              No Screenshot Uploaded
            </Text>
            <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
              Start by uploading or taking a screenshot to check for scams
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  uploadCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  uploadSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
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
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  analyzeButton: {
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
    fontWeight: "600",
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
  },
  emptyContainer: {},
  emptyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "600",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: FONT_SIZES.md,
    textAlign: "center",
  },
  resultCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  riskLevel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginLeft: SPACING.md,
  },
  summary: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  flagText: {
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.md,
    flex: 1,
  },
  recommendation: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
});