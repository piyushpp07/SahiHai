
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import FastConfetti from 'react-native-fast-confetti';

const Confetti = ({ show }) => {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (show && confettiRef.current) {
      confettiRef.current.startConfetti();
    }
  }, [show]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <FastConfetti ref={confettiRef} count={100} size={15} duration={3000} />
    </View>
  );
};

export default Confetti;
