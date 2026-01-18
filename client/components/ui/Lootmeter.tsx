import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Canvas, Path, LinearGradient, vec, Skia } from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  withRepeat, 
  withSequence,
  useAnimatedStyle,
  Easing 
} from 'react-native-reanimated';
import { GlassCard } from './GlassCard';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Lootmeter = () => {
  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Initial entry animation
    progress.value = withTiming(0.85, { 
      duration: 1500, 
      easing: Easing.out(Easing.exp) 
    });

    // Subtle pulsing for the "Extreme Risk" intensity
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const radius = 80;
    const path = Skia.Path.Make();
    // Semi-circle arc: from left (180 deg) to right (0 deg)
    path.addArc({ x: 10, y: 10, width: 160, height: 160 }, 180, 180 * progress.value);
    return {
      path: path,
    };
  });

  const backgroundPath = Skia.Path.Make();
  backgroundPath.addArc({ x: 10, y: 10, width: 160, height: 160 }, 180, 180);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.8 + (pulse.value - 1) * 2,
  }));

  return (
    <GlassCard intensity={20} className="bg-slate-900 border-white/10 p-6 rounded-[40px]">
       <View className="items-center">
          <Text className="text-blue-400 font-bold uppercase tracking-[2px] text-[10px] mb-8">Action Engine Intelligence</Text>
          
          <View className="h-32 w-full items-center justify-center">
             <Canvas style={{ width: 180, height: 100 }}>
                {/* Background Track */}
                <Path
                    path={backgroundPath}
                    color="#1e293b"
                    style="stroke"
                    strokeWidth={16}
                    strokeCap="round"
                />
                
                {/* Animated Progress Arc */}
                <AnimatedPath
                    path={Skia.Path.Make()}
                    animatedProps={animatedProps}
                    style="stroke"
                    strokeWidth={16}
                    strokeCap="round"
                >
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(180, 0)}
                        colors={["#4F46E5", "#EF4444"]}
                    />
                </AnimatedPath>
             </Canvas>

             <View className="absolute bottom-2 items-center">
                <Text className="text-white text-3xl font-black">8.5</Text>
                <Animated.View style={pulseStyle}>
                    <Text className="text-red-500 font-extrabold text-[10px] uppercase tracking-[2px] mt-1">Extreme Risk</Text>
                </Animated.View>
             </View>
          </View>

          <View className="mt-6 bg-red-500/10 border border-red-500/20 p-5 rounded-[32px] w-full">
            <Text className="text-red-400 text-center text-[11px] font-bold leading-5">
               Detection Engine: High probability of phishing detected in recent UPI intent requests.
            </Text>
          </View>
       </View>
    </GlassCard>
  );
};
