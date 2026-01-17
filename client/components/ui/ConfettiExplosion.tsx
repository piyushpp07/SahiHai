import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';
import * as Haptics from 'expo-haptics';

export const ConfettiExplosion = () => {
  const confettiRef = useRef<any>(null);

  const trigger = () => {
    confettiRef.current?.trigger();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Expose trigger method if using forwardRef, but for now we auto-trigger on mount or just have it ready
  // In a real usage, this would be controlled by a prop or exposed via ref
  
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Confetti ref={confettiRef} />
    </View>
  );
};
