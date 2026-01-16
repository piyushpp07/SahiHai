import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";
import {
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/style";

export default function SarkariTab() {
  const { colors } = useTheme();
  const router = useRouter();
  const [recording, setRecording] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [manualInput, setManualInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const recordingTimerRef = useRef(null);

  const complaintCategories = [
    { id: "consumer", icon: "cart", title: "Consumer Rights", subtitle: "Product/Service complaints", color: colors.primary },
    { id: "electricity", icon: "flash", title: "Electricity", subtitle: "Power supply issues", color: colors.secondary },
    { id: "water", icon: "water", title: "Water Supply", subtitle: "Municipal water problems", color: "#06B6D4" },
    { id: "police", icon: "shield-checkmark", title: "Police/Law", subtitle: "Legal complaints", color: "#8B5CF6" },
    { id: "medical", icon: "medical", title: "Medical", subtitle: "Healthcare issues", color: colors.error },
    { id: "education", icon: "school", title: "Education", subtitle: "School/college issues", color: colors.success },
    { id: "rti", icon: "document-text", title: "RTI Request", subtitle: "Right to Information", color: "#EC4899" },
    { id: "other", icon: "ellipsis-horizontal", title: "Other", subtitle: "General complaints", color: colors.textSecondary },
  ];

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

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    clearInterval(recordingTimerRef.current);
    setRecordingTime(0);
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

  const processManualInput = async () => {
    if (!manualInput.trim()) {
      return Alert.alert("Input Required", "Please type your complaint first.");
    }
    setLoading(true);
    try {
      const res = await api.post("/api/sarkari/draft-text", {
        complaint: manualInput,
      });
      setComplaintText(res.data.letter);
    } catch (e) {
      Alert.alert("Error", "Failed to process your complaint.");
    } finally {
      setLoading(false);
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

      const pdfPath = `${FileSystem.documentDirectory}SarkariLetter.pdf`;
      await FileSystem.writeAsStringAsync(pdfPath, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert(`Sharing isn't available on your platform`);
        return;
      }

      await Sharing.shareAsync(pdfPath, {
        dialogTitle: "Share your complaint letter",
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to generate or share PDF.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const navigateToAIChat = () => {
    router.push("/(tabs)/chat");
  };

  const styles = getStyles(colors);

  if (!selectedCategory && !complaintText) {
    return (
      <View style={styles.wrapper}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📜 Sarkari Saathi</Text>
            <Text style={styles.headerSubtitle}>
              Generate professional complaint letters for government departments
            </Text>
          </View>
          <View style={styles.grid}>
            {complaintCategories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleCategorySelect(item.id)}
              >
                <Ionicons name={item.icon} size={32} color={item.color} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        {!complaintText ? (
          <View>
            <TouchableOpacity onPress={() => { setSelectedCategory(null); setManualInput(""); }} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
              <Text style={styles.backButtonText}>Change Category</Text>
            </TouchableOpacity>
            <Text style={styles.recordTitle}>Describe Your Issue</Text>
            <Text style={styles.recordSubtitle}>
              You can either record your complaint or type it manually.
            </Text>

            <View style={styles.recordContainer}>
              <TouchableOpacity
                style={[styles.micButton, recording && styles.micButtonRecording]}
                onPress={recording ? stopRecording : startRecording}
                disabled={loading}
              >
                <Ionicons name={recording ? "stop-circle" : "mic"} size={48} color={colors.white} />
              </TouchableOpacity>
              {recording && (
                <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
              )}
              <Text style={styles.micLabel}>{recording ? 'Recording...' : 'Press to Record'}</Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.manualInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your complaint here..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={manualInput}
                onChangeText={setManualInput}
              />
              <TouchableOpacity
                style={styles.processButton}
                onPress={processManualInput}
                disabled={loading}
              >
                <Text style={styles.processButtonText}>Generate Letter</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Your Drafted Letter</Text>
            <View style={styles.letterBox}>
              <Text style={styles.letterText}>{complaintText}</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.pdfButton} onPress={generatePDF} disabled={loading}>
                <Ionicons name="download-outline" size={20} color={colors.white} />
                <Text style={styles.pdfButtonText}>Save as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={() => { setComplaintText(""); setManualInput(""); setSelectedCategory(null); }} disabled={loading}>
                <Ionicons name="refresh" size={20} color={colors.textPrimary} />
                <Text style={styles.resetButtonText}>Start Over</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: SPACING.md,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        alignItems: 'center'
    },
    headerTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    headerSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: colors.textSecondary,
      textAlign: 'center'
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: SPACING.lg,
    },
    card: {
      width: "48%",
      backgroundColor: colors.card,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.md,
      alignItems: "center",
      ...SHADOWS.sm,
    },
    cardTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: "600",
      color: colors.textPrimary,
      marginTop: SPACING.sm,
    },
    cardSubtitle: {
      fontSize: FONT_SIZES.xs,
      color: colors.textSecondary,
      textAlign: "center",
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md
    },
    backButtonText: {
      color: colors.textPrimary,
      marginLeft: SPACING.xs
    },
    recordTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    recordSubtitle: {
        fontSize: FONT_SIZES.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    recordContainer: {
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    micButton: {
        backgroundColor: colors.primary,
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    micButtonRecording: {
        backgroundColor: colors.error,
    },
    micLabel: {
        marginTop: SPACING.md,
        color: colors.textPrimary,
        fontSize: FONT_SIZES.md,
    },
    timerText: {
        marginTop: SPACING.sm,
        fontSize: FONT_SIZES.lg,
        color: colors.textSecondary,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: colors.textSecondary,
    },
    manualInputContainer: {
        // ...
    },
    textInput: {
        backgroundColor: colors.input,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
        minHeight: 120,
        textAlignVertical: 'top',
        color: colors.textPrimary,
        borderColor: colors.border,
        borderWidth: 1,
    },
    processButton: {
        backgroundColor: colors.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    processButtonText: {
        color: colors.white,
        fontWeight: '600'
    },
    resultContainer: {
        // ...
    },
    resultTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: SPACING.md,
    },
    letterBox: {
        backgroundColor: colors.card,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        minHeight: 200,
    },
    letterText: {
        color: colors.textPrimary,
        lineHeight: 22,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.lg,
    },
    pdfButton: {
        flexDirection: 'row',
        backgroundColor: colors.success,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    pdfButtonText: {
        color: colors.white,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
    resetButton: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
        borderColor: colors.border,
        borderWidth: 1,
    },
    resetButtonText: {
        color: colors.textPrimary,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    }
  });