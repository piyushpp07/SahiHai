
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScratchCard from 'react-native-scratch-card';
import Confetti from './Confetti'; // Import the Confetti component
import * as Haptics from 'expo-haptics'; // Import Haptics

const RewardScratchCard = ({ reward, onScratchComplete }) => {
  const [scratchPercent, setScratchPercent] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleScratch = (percent) => {
    setScratchPercent(percent);
    if (percent > 50 && !showConfetti) {
      setShowConfetti(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Trigger haptics
      onScratchComplete(reward);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Scratch to reveal your reward!</Text>
      <ScratchCard
        source={{ uri: 'https://via.placeholder.com/300x150?text=Scratch+Me' }} // Placeholder scratch image
        brushWidth={30}
        onScratch={(percent) => handleScratch(percent)}
        onScratchDone={() => {}}
        containerStyle={styles.scratchCardContainer}
        scratchEnabled={true}
        wipeThreshold={50} // 50% scratch to reveal
      >
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>{reward}</Text>
        </View>
      </ScratchCard>
      {showConfetti && <Confetti show={showConfetti} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  scratchCardContainer: {
    width: 300,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden', // Ensure reward text doesn't leak
  },
  rewardContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RewardScratchCard;
