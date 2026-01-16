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
import * as Print from "expo-print";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../utils/api";
import {
  COLORS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
} from "../constants/colors";

export default function SarkariTab() {
  const router = useRouter();
  const [recording, setRecording] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [manualInput, setManualInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const recordingTimerRef = useRef(null);

  // Complaint Categories
  const complaintCategories = [
    {
      id: "consumer",
      icon: "cart",
      title: "Consumer Rights",
      subtitle: "Product/Service complaints",
      color: "#3B82F6",
    },
    {
      id: "electricity",
      icon: "flash",
      title: "Electricity",
      subtitle: "Power supply issues",
      color: "#F59E0B",
    },
    {
      id: "water",
      icon: "water",
      title: "Water Supply",
      subtitle: "Municipal water problems",
      color: "#06B6D4",
    },
    {
      id: "police",
      icon: "shield-checkmark",
      title: "Police/Law",
      subtitle: "Legal complaints",
      color: "#8B5CF6",
    },
    {
      id: "medical",
      icon: "medical",
      title: "Medical",
      subtitle: "Healthcare issues",
      color: "#EF4444",
    },
    {
      id: "education",
      icon: "school",
      title: "Education",
      subtitle: "School/college issues",
      color: "#10B981",
    },
    {
      id: "rti",
      icon: "document-text",
      title: "RTI Request",
      subtitle: "Right to Information",
      color: "#EC4899",
    },
    {
      id: "other",
      icon: "ellipsis-horizontal",
      title: "Other",
      subtitle: "General complaints",
      color: "#6B7280",
    },
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
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "complaint.m4a",
        type: "audio/m4a",
      });

      if (selectedCategory) {
        formData.append("category", selectedCategory);
      }

      const res = await api.post("/api/sarkari/draft", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setComplaintText(res.data.letter || res.data);
    } catch (error) {
      console.error("Error processing audio:", error);
      Alert.alert("Error", "Failed to process audio. Please try again.");
    } finally {
      setLoading(false);
      setRecording(null);
      setRecordingTime(0);
    }
  };

  const processManualInput = async () => {
    if (!manualInput.trim()) {
      Alert.alert("Empty Input", "Please type a complaint or description.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/sarkari/draft-text", {
        complaint: manualInput,
        category: selectedCategory,
      });
      setComplaintText(res.data.letter || res.data);
      setManualInput("");
    } catch (error) {
      console.error("Error processing text:", error);
      Alert.alert("Error", "Failed to generate letter. Please try again.");
      // Fallback
      setComplaintText(manualInput);
      setManualInput("");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!complaintText) return;

    try {
      await Print.printAsync({
        html: `
          <html>
            <head>
              <style>
                body { 
                  font-family: 'Times New Roman', serif; 
                  padding: 40px; 
                  line-height: 1.8;
                  color: #333;
                }
                h1 { 
                  color: #1a1a1a; 
                  margin-bottom: 30px;
                  text-align: center;
                  font-size: 24px;
                  border-bottom: 2px solid #333;
                  padding-bottom: 10px;
                }
                .content {
                  white-space: pre-wrap;
                  font-size: 14px;
                  text-align: justify;
                }
                .footer {
                  margin-top: 50px;
                  padding-top: 20px;
                  border-top: 1px solid #ccc;
                  color: #666;
                  font-size: 11px;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <h1>Official Complaint Letter</h1>
              <div class="content">${complaintText}</div>
              <div class="footer">
                Generated by SahiHai - Your Digital Rights Assistant<br/>
                Date: ${new Date().toLocaleDateString("en-IN")}
              </div>
            </body>
          </html>
        `,
      });
      Alert.alert("Success", "PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      Alert.alert("Error", "Failed to generate PDF.");
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

  // Show category selection if no category selected and no letter generated
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

          {/* AI Chat Option */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.aiChatCard, SHADOWS.lg]}
              onPress={navigateToAIChat}
            >
              <View style={styles.aiChatIcon}>
                <Ionicons name="chatbubbles" size={32} color={COLORS.WHITE} />
              </View>
              <View style={styles.aiChatContent}>
                <Text style={styles.aiChatTitle}>
                  💬 Chat with AI Assistant
                </Text>
                <Text style={styles.aiChatSubtitle}>
                  Get instant help drafting your complaint
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={COLORS.ACCENT}
              />
            </TouchableOpacity>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Complaint Category</Text>
            <Text style={styles.sectionSubtitle}>
              Choose the type of complaint you want to file
            </Text>

            <View style={styles.categoriesGrid}>
              {complaintCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, SHADOWS.md]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={28}
                      color={COLORS.WHITE}
                    />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categorySubtitle}>
                    {category.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Section */}
          <View style={[styles.infoCard, SHADOWS.sm]}>
            <Ionicons name="information-circle" size={24} color={COLORS.INFO} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoText}>
                1. Select your complaint category{"\n"}
                2. Record or type your complaint{"\n"}
                3. AI will generate a professional letter{"\n"}
                4. Download as PDF and submit
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedCategory(null);
              setComplaintText("");
            }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.ACCENT} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {selectedCategory
                ? complaintCategories.find((c) => c.id === selectedCategory)
                    ?.title
                : "Sarkari Saathi"}
            </Text>
            <Text style={styles.headerSubtitle}>
              Generate official complaint letters
            </Text>
          </View>
        </View>

        {/* Voice Recording Section */}
        {!complaintText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎤 Record Your Complaint</Text>

            <View style={[styles.recordingCard, SHADOWS.md]}>
              <View style={styles.recordingContent}>
                <Ionicons
                  name={recording ? "mic" : "mic-outline"}
                  size={64}
                  color={recording ? COLORS.DANGER : COLORS.ACCENT}
                />

                {recording && (
                  <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                      {formatTime(recordingTime)}
                    </Text>
                    <View style={styles.recordingIndicator}>
                      <View style={styles.recordingDot} />
                      <Text style={styles.recordingText}>Recording...</Text>
                    </View>
                  </View>
                )}

                {!recording && (
                  <Text style={styles.recordingPrompt}>
                    Speak clearly about your complaint in Hindi, English, or
                    Hinglish
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.recordButton,
                  recording && styles.recordButtonActive,
                  loading && styles.recordButtonDisabled,
                ]}
                onPress={recording ? stopRecording : startRecording}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} size="large" />
                ) : (
                  <Ionicons
                    name={recording ? "stop" : "mic"}
                    size={32}
                    color={COLORS.WHITE}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Manual Input Section */}
            <View style={[styles.manualCard, SHADOWS.md]}>
              <View style={styles.manualHeader}>
                <Ionicons name="create" size={24} color={COLORS.ACCENT} />
                <Text style={styles.manualTitle}>Or Type Your Complaint</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Describe your complaint in detail... Include dates, names, and specific incidents."
                placeholderTextColor={COLORS.TEXT_LIGHT}
                multiline
                numberOfLines={8}
                value={manualInput}
                onChangeText={setManualInput}
                editable={!loading}
              />
              <TouchableOpacity
                style={[
                  styles.processButton,
                  loading && styles.processButtonDisabled,
                ]}
                onPress={processManualInput}
                disabled={loading || !manualInput.trim()}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color={COLORS.WHITE} />
                    <Text style={styles.processButtonText}>
                      Generate Letter with AI
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Generated Letter Section */}
        {complaintText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Drafted Letter</Text>

            <View style={[styles.letterCard, SHADOWS.md]}>
              <View style={styles.letterHeader}>
                <Ionicons
                  name="document-text"
                  size={28}
                  color={COLORS.ACCENT}
                />
                <Text style={styles.letterHeaderText}>
                  Official Complaint Letter
                </Text>
              </View>

              <ScrollView style={styles.letterContent} nestedScrollEnabled>
                <Text style={styles.letterText}>{complaintText}</Text>
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.pdfButton, SHADOWS.md]}
                onPress={generatePDF}
              >
                <Ionicons name="download" size={20} color={COLORS.WHITE} />
                <Text style={styles.pdfButtonText}>Download PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editButton, SHADOWS.sm]}
                onPress={() => {
                  setComplaintText("");
                  setRecordingTime(0);
                }}
              >
                <Ionicons name="create" size={20} color={COLORS.ACCENT} />
                <Text style={styles.editButtonText}>Edit/Regenerate</Text>
              </TouchableOpacity>
            </View>

            {/* Tips Section */}
            <View style={[styles.tipsCard, SHADOWS.sm]}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={22} color={COLORS.WARNING} />
                <Text style={styles.tipsTitle}>Next Steps</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.SUCCESS}
                />
                <Text style={styles.tipText}>
                  Download and print the letter on letterhead
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.SUCCESS}
                />
                <Text style={styles.tipText}>
                  Sign and attach supporting documents
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.SUCCESS}
                />
                <Text style={styles.tipText}>
                  Submit to the appropriate authority
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.SUCCESS}
                />
                <Text style={styles.tipText}>Keep a copy for your records</Text>
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
    backgroundColor: COLORS.BG_SECONDARY,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
  },
  // AI Chat Card
  aiChatCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  aiChatIcon: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.ACCENT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  aiChatContent: {
    flex: 1,
  },
  aiChatTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  aiChatSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  // Categories Grid
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  categorySubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  // Recording Card
  recordingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  recordingContent: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  timerContainer: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  timerText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.DANGER,
    marginRight: SPACING.sm,
  },
  recordingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.DANGER,
    fontWeight: "600",
  },
  recordingPrompt: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonActive: {
    backgroundColor: COLORS.DANGER,
  },
  recordButtonDisabled: {
    opacity: 0.6,
  },
  // Manual Input Card
  manualCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  manualHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  manualTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.BG_SECONDARY,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 150,
    textAlignVertical: "top",
    marginBottom: SPACING.md,
  },
  processButton: {
    backgroundColor: COLORS.ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  processButtonDisabled: {
    opacity: 0.6,
  },
  processButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  // Letter Card
  letterCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  letterHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT,
    marginBottom: SPACING.md,
  },
  letterHeaderText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.sm,
  },
  letterContent: {
    maxHeight: 400,
  },
  letterText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  pdfButton: {
    flex: 1,
    backgroundColor: COLORS.ACCENT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  pdfButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
  },
  editButtonText: {
    color: COLORS.ACCENT,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  // Tips Card
  tipsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.sm,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});
