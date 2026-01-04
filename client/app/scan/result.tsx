import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { AssistantModal } from "../../src/components/AssistantModal"; // Import AssistantModal

export default function ResultScreen() {
  const router = useRouter();
  const [isAssistantVisible, setIsAssistantVisible] = useState(false); // State for modal visibility

  const handleGoBack = () => {
    router.back();
  };

  // Placeholder data for AssistantModal
  const dummyScanResult = {
    flaggedItems: [
      { item: "Milk", claimedPrice: 50, marketPrice: 45 },
      { item: "Bread", claimedPrice: 40, marketPrice: 35 },
    ],
    // Add other relevant scan data structure here if needed by the modal's logic
  };
  const dummyScanId = "scan123";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result Screen</Text>
      <Text>This screen will display scan results.</Text>
      <Button title="Go Back" onPress={handleGoBack} />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Talk to Assistant"
          onPress={() => setIsAssistantVisible(true)}
        />
      </View>

      <AssistantModal
        isVisible={isAssistantVisible}
        onClose={() => setIsAssistantVisible(false)}
        scanResult={dummyScanResult}
        scanId={dummyScanId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
