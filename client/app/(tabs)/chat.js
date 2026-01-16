import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// API Base URL from environment variable
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:5051";

export default function ChatAssistant() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Namaste! 🙏 I'm SahiHai AI Assistant. I can help you with:\n\n✅ Consumer rights & complaints\n📱 Scam detection\n📄 Legal letter drafting\n💰 Bill analysis\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const quickActions = [
    {
      icon: "speedometer",
      label: "Bill Check",
      query: "How do I check if my bill has overcharges?",
    },
    {
      icon: "shield-checkmark",
      label: "Scam Alert",
      query: "How can I identify and report scams?",
    },
    {
      icon: "document-text",
      label: "Legal Help",
      query: "Help me draft a consumer complaint letter",
    },
    {
      icon: "chatbubbles",
      label: "Consumer Rights",
      query: "Tell me about my consumer rights in India",
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Real API call to backend
      const response = await fetch(`${API_BASE_URL}/api/chat/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text.trim(),
          scanContext: {}, // Can add bill scan context if available
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text:
          data.assistantReply ||
          data.message ||
          "I'm here to help! How can I assist you?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error connecting to the AI assistant. Please check your connection and try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query) => {
    handleSend(query);
  };

  const renderMessage = (message) => {
    const isBot = message.sender === "bot";
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessage : styles.userMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isBot ? colors.BG_SECONDARY : colors.ACCENT,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isBot ? colors.TEXT_PRIMARY : colors.WHITE,
              },
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              {
                color: isBot ? colors.TEXT_SECONDARY : colors.WHITE,
              },
            ]}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BG_PRIMARY }]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Quick Actions */}
        <View
          style={[
            styles.quickActions,
            { backgroundColor: colors.BG_SECONDARY },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionButton,
                  { borderColor: colors.BORDER },
                ]}
                onPress={() => handleQuickAction(action.query)}
              >
                <Ionicons name={action.icon} size={20} color={colors.ACCENT} />
                <Text
                  style={[
                    styles.quickActionText,
                    { color: colors.TEXT_PRIMARY },
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View
                style={[
                  styles.messageBubble,
                  { backgroundColor: colors.BG_SECONDARY },
                ]}
              >
                <ActivityIndicator size="small" color={colors.ACCENT} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.BG_SECONDARY },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.BG_PRIMARY,
                color: colors.TEXT_PRIMARY,
                borderColor: colors.BORDER,
              },
            ]}
            placeholder="Type your message..."
            placeholderTextColor={colors.TEXT_SECONDARY}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.ACCENT
                  : colors.BG_TERTIARY,
              },
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? colors.WHITE : colors.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  quickActions: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  botMessage: {
    alignItems: "flex-start",
  },
  userMessage: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
