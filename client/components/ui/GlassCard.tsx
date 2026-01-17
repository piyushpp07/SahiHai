import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface GlassCardProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

export const GlassCard = ({ intensity = 20, children, style, className, ...props }: GlassCardProps) => {
  return (
    <View 
      className={`overflow-hidden rounded-[32px] border border-white/20 shadow-xl ${className}`}
      {...props}
    >
      <BlurView intensity={intensity} tint="light" className="p-6">
        {children}
      </BlurView>
    </View>
  );
};
