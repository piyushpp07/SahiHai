import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LOADING_MESSAGES: string[] = [
  "Reading Bill Details...",
  "Fetching Local Market Prices...",
  "Analyzing Line Items for Scams...",
  "Running final checks...",
  "Finalizing Your Report...",
];

const SmartLoader = () => {
  const [messageIndex, setMessageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/scanner.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.loadingText}>{LOADING_MESSAGES[messageIndex]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
  },
});

export default SmartLoader;
