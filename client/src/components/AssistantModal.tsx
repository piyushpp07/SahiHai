import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

// Replace with your actual server IP
const API_URL = "http://localhost:5050/api/chat/consult";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface AssistantModalProps {
  isVisible: boolean;
  onClose: () => void;
  scanResult: any; // You might want to define a more specific type for scanResult
  scanId: string;
}

export const AssistantModal = ({
  isVisible,
  onClose,
  scanResult,
  scanId,
}: AssistantModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const offset = useSharedValue(500);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  const handleOpen = useCallback(() => {
    offset.value = withTiming(0);
  }, [offset]);

  const handleClose = useCallback(() => {
    offset.value = withTiming(500, undefined, (isFinished?: boolean) => {
      if (isFinished) {
        runOnJS(onClose)();
      }
    });
  }, [offset, onClose]);

  useEffect(() => {
    if (isVisible) {
      handleOpen();
    }
  }, [isVisible, handleOpen]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post<{ reply: string }>(API_URL, {
        scanId,
        userMessage: input,
        scanContext: scanResult,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error consulting assistant:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I am unable to respond right now.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={item.sender === "user" ? styles.userText : styles.botText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <Modal visible={isVisible} transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalBackdrop}
      >
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>SahiHai Assistant</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={{ paddingBottom: 10 }}
            inverted
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="e.g., How do I argue this?"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={isLoading}
            >
              <Ionicons name="send-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
    marginTop: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#3498db",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#f1f0f0",
    alignSelf: "flex-start",
  },
  userText: {
    color: "white",
    fontSize: 16,
  },
  botText: {
    color: "black",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#f1f0f0",
    borderRadius: 22,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
});
