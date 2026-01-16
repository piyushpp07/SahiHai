import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";
import {
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function LootMeterTab() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      analyzeBill(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to scan bills"
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      analyzeBill(result.assets[0].uri);
    }
  };

  const analyzeBill = async (imageUri) => {
    setAnalyzing(true);

    try {
      // Prepare FormData for API call
      const formData = new FormData();
      formData.append("mediaFile", {
        uri: imageUri,
        name: "bill.jpg",
        type: "image/jpeg",
      });

      // Call backend API
      const response = await api.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalyzing(false);

      // Check if we got a valid response
      if (response.data && response.data.scam_score !== undefined) {
        const lootMeter = Math.round(response.data.scam_score);
        const summary = response.data.summary || "Analysis complete";
        const items = response.data.items || [];
        const total = response.data.total || 0;

        // Navigate to result screen with real data
        router.push({
          pathname: "/result/[id]",
          params: {
            id: Date.now().toString(),
            lootMeter: lootMeter,
            summary: summary,
            itemsJson: JSON.stringify(items),
            total: total,
          },
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setAnalyzing(false);
      console.error("Bill analysis error:", error);

      Alert.alert(
        "Analysis Failed",
        "Could not analyze the bill. Please try again or check your internet connection.",
        [
          {
            text: "Try Again",
            onPress: () => setImage(null),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.BG_PRIMARY }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.ACCENT}15` },
            ]}
          >
            <Ionicons name="speedometer" size={48} color={colors.ACCENT} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.TEXT_PRIMARY }]}>
            Loot Meter
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.TEXT_SECONDARY }]}
          >
            Scan your bills to check if you're being overcharged
          </Text>
        </View>

        {/* Image Preview */}
        {image && !analyzing && (
          <View
            style={[
              styles.imagePreview,
              SHADOWS.md,
              { backgroundColor: colors.BG_CARD },
            ]}
          >
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={32} color={colors.DANGER} />
            </TouchableOpacity>
          </View>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <View
            style={[
              styles.analyzingCard,
              SHADOWS.lg,
              { backgroundColor: colors.BG_CARD },
            ]}
          >
            <View style={styles.loaderContainer}>
              <View
                style={[styles.spinner, { borderTopColor: colors.ACCENT }]}
              />
            </View>
            <Text
              style={[styles.analyzingText, { color: colors.TEXT_PRIMARY }]}
            >
              Analyzing Bill...
            </Text>
            <Text
              style={[
                styles.analyzingSubtext,
                { color: colors.TEXT_SECONDARY },
              ]}
            >
              Checking for overcharges and scams
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {!analyzing && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                SHADOWS.md,
                { backgroundColor: colors.ACCENT },
              ]}
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={32} color={colors.WHITE} />
              <Text style={[styles.actionButtonText, { color: colors.WHITE }]}>
                Take Photo
              </Text>
              <Text
                style={[
                  styles.actionButtonSubtext,
                  { color: `${colors.WHITE}CC` },
                ]}
              >
                Scan bill with camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                SHADOWS.md,
                {
                  backgroundColor: colors.BG_CARD,
                  borderWidth: 2,
                  borderColor: colors.ACCENT,
                },
              ]}
              onPress={pickImageFromGallery}
              activeOpacity={0.8}
            >
              <Ionicons name="images" size={32} color={colors.ACCENT} />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.TEXT_PRIMARY },
                ]}
              >
                Choose from Gallery
              </Text>
              <Text
                style={[
                  styles.actionButtonSubtext,
                  { color: colors.TEXT_SECONDARY },
                ]}
              >
                Upload existing bill photo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Cards */}
        {!analyzing && !image && (
          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: colors.TEXT_PRIMARY }]}>
              How it works
            </Text>

            <View
              style={[
                styles.infoCard,
                SHADOWS.sm,
                { backgroundColor: colors.BG_CARD },
              ]}
            >
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.SUCCESS}15` },
                ]}
              >
                <Ionicons name="scan" size={24} color={colors.SUCCESS} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoCardTitle, { color: colors.TEXT_PRIMARY }]}
                >
                  1. Scan Your Bill
                </Text>
                <Text
                  style={[
                    styles.infoCardText,
                    { color: colors.TEXT_SECONDARY },
                  ]}
                >
                  Take a photo or upload image of any bill
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.infoCard,
                SHADOWS.sm,
                { backgroundColor: colors.BG_CARD },
              ]}
            >
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.WARNING}15` },
                ]}
              >
                <Ionicons name="analytics" size={24} color={colors.WARNING} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoCardTitle, { color: colors.TEXT_PRIMARY }]}
                >
                  2. AI Analysis
                </Text>
                <Text
                  style={[
                    styles.infoCardText,
                    { color: colors.TEXT_SECONDARY },
                  ]}
                >
                  Our AI checks prices against market rates
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.infoCard,
                SHADOWS.sm,
                { backgroundColor: colors.BG_CARD },
              ]}
            >
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.ACCENT}15` },
                ]}
              >
                <Ionicons name="speedometer" size={24} color={colors.ACCENT} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoCardTitle, { color: colors.TEXT_PRIMARY }]}
                >
                  3. Get Loot Score
                </Text>
                <Text
                  style={[
                    styles.infoCardText,
                    { color: colors.TEXT_SECONDARY },
                  ]}
                >
                  See how much you're being overcharged
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: "center",
    paddingHorizontal: SPACING.xl,
    lineHeight: 22,
  },
  imagePreview: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.xl,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
  },
  analyzingCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  loaderContainer: {
    marginBottom: SPACING.lg,
  },
  spinner: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 4,
    borderColor: "#e0e0e0",
    borderTopWidth: 4,
  },
  analyzingText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  analyzingSubtext: {
    fontSize: FONT_SIZES.md,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  actionButtonSubtext: {
    fontSize: FONT_SIZES.sm,
  },
  infoSection: {
    marginTop: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  infoCard: {
    flexDirection: "row",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  infoCardText: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
});
