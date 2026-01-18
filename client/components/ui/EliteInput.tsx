import { View, TextInput, TextInputProps, ViewStyle, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';

interface EliteInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
  onIconPress?: () => void;
}

export const EliteInput: React.FC<EliteInputProps> = ({ 
  icon, 
  iconColor = '#9CA3AF', 
  containerStyle, 
  rightElement,
  onIconPress,
  ...props 
}) => {
  return (
    <View className="shadow-2xl shadow-gray-200" style={containerStyle}>
      <GlassCard 
        intensity={45} 
        className="bg-white/95 border-white/80 flex-row items-center px-4 rounded-[28px]"
        style={{ height: 72 }} // Balanced Elite Height
      >
        {icon && (
          <Pressable onPress={onIconPress} disabled={!onIconPress} className="mr-4">
            <Ionicons name={icon} size={28} color={iconColor} />
          </Pressable>
        )}
        
        <TextInput
          className="flex-1 text-lg font-bold"
          style={{ 
            color: '#111827', 
            textAlignVertical: 'center',
            height: '100%',
            fontWeight: '800',
          }}
          placeholderTextColor="#D1D5DB"
          selectionColor={iconColor}
          {...props}
        />

        {rightElement && (
          <View className="ml-2">
            {rightElement}
          </View>
        )}
      </GlassCard>
    </View>
  );
};
