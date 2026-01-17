
import React from 'react';
import { MotiView } from 'moti';
import { View } from 'react-native';

const ShimmerBox = ({ width, height, borderRadius = 4, style }) => {
  return (
    <MotiView
      from={{ opacity: 0.2 }}
      animate={{ opacity: 0.6 }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
      style={[{ width, height, borderRadius, backgroundColor: '#e0e0e0' }, style]}
    />
  );
};

export default ShimmerBox;
