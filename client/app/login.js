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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Required Fields", "Please enter both email and password");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
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
          {/* Modern Header */}
          <View style={styles.header}>
            <View
              style={[styles.logoCircle, { backgroundColor: colors.ACCENT }]}
            >
              <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandName, { color: colors.TEXT_PRIMARY }]}>
              SahiHai
            </Text>
            <Text style={[styles.tagline, { color: colors.TEXT_SECONDARY }]}>
              Protect Your Rights, Detect Frauds
            </Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: colors.BG_SECONDARY }]}>
            <Text style={[styles.cardTitle, { color: colors.TEXT_PRIMARY }]}>
              Sign in
            </Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[styles.inputLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Email or mobile phone number
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
                  placeholder="Enter your password"
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text
                style={[styles.forgotPasswordText, { color: colors.ACCENT }]}
              >
                Forgot your password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { backgroundColor: colors.ACCENT },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.signInButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={[styles.terms, { color: colors.TEXT_TERTIARY }]}>
              By continuing, you agree to SahiHai&apos;s{" "}
              <Text style={{ color: colors.ACCENT }}>Terms of Use</Text> and{" "}
              <Text style={{ color: colors.ACCENT }}>Privacy Notice</Text>
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.BORDER }]}
            />
            <Text style={[styles.dividerText, { color: colors.TEXT_TERTIARY }]}>
              New to SahiHai?
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.BORDER }]}
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.createAccountButton, { borderColor: colors.BORDER }]}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.createAccountText, { color: colors.TEXT_PRIMARY }]}
            >
              Create your SahiHai account
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
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
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
  cardTitle: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "500",
  },
  signInButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: {
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
    textAlign: "center",
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
  createAccountButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    height: 20,
  },
});
