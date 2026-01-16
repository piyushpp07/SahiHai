import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { signup } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Signup Failed", result.error || "Could not create account");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.TEXT_PRIMARY} />
          </TouchableOpacity>

          {/* Modern Header */}
          <View style={styles.header}>
            <View
              style={[styles.logoCircle, { backgroundColor: colors.ACCENT }]}
            >
              <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandName, { color: colors.TEXT_PRIMARY }]}>
              Create account
            </Text>
          </View>

          {/* Signup Card */}
          <View style={[styles.card, { backgroundColor: colors.BG_SECONDARY }]}>
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Your name
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor:
                      focusedInput === "name" ? colors.ACCENT : colors.BORDER,
                    borderWidth: focusedInput === "name" ? 2 : 1,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.TEXT_PRIMARY }]}
                  placeholder="First and last name"
                  placeholderTextColor={colors.TEXT_TERTIARY}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Mobile number or email
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor:
                      focusedInput === "email" ? colors.ACCENT : colors.BORDER,
                    borderWidth: focusedInput === "email" ? 2 : 1,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.TEXT_PRIMARY }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.TEXT_TERTIARY}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor:
                      focusedInput === "password"
                        ? colors.ACCENT
                        : colors.BORDER,
                    borderWidth: focusedInput === "password" ? 2 : 1,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.TEXT_PRIMARY, flex: 1 },
                  ]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.TEXT_TERTIARY}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={colors.TEXT_TERTIARY}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.helpText, { color: colors.TEXT_TERTIARY }]}>
                Passwords must be at least 6 characters
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Re-enter password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.BG_INPUT,
                    borderColor:
                      focusedInput === "confirmPassword"
                        ? colors.ACCENT
                        : colors.BORDER,
                    borderWidth: focusedInput === "confirmPassword" ? 2 : 1,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.TEXT_PRIMARY, flex: 1 },
                  ]}
                  placeholder="Enter password again"
                  placeholderTextColor={colors.TEXT_TERTIARY}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color={colors.TEXT_TERTIARY}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: colors.ACCENT },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={[styles.terms, { color: colors.TEXT_TERTIARY }]}>
              By creating an account, you agree to SahiHai&apos;s{" "}
              <Text style={{ color: colors.ACCENT }}>Conditions of Use</Text>{" "}
              and <Text style={{ color: colors.ACCENT }}>Privacy Notice</Text>
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.BORDER }]}
            />
            <Text style={[styles.dividerText, { color: colors.TEXT_TERTIARY }]}>
              Already have an account?
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.BORDER }]}
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, { borderColor: colors.BORDER }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.signInButtonText, { color: colors.TEXT_PRIMARY }]}
            >
              Sign in to your account
            </Text>
          </TouchableOpacity>

          {/* Footer Spacing */}
          <View style={styles.footer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  card: {
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
  },
  eyeIcon: {
    padding: 8,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
  },
  continueButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  terms: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "left",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: "500",
  },
  signInButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    height: 20,
  },
});
