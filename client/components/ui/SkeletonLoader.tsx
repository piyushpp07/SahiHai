import { View, DimensionValue } from 'react-native';
import { MotiView } from 'moti';

interface SkeletonLoaderProps {
    width?: DimensionValue;
    height?: number;
}

export const SkeletonLoader = ({ width = '100%', height = 20 }: SkeletonLoaderProps) => {
  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
      }}
      style={{
        width, // DimensionValue is compatible now
        height,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 8,
      }}
    />
  );
};

