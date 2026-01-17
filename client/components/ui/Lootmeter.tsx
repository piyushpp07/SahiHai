import React from 'react';
import { View, Text } from 'react-native';
import { Canvas, Path, Skia, vec, LinearGradient } from "@shopify/react-native-skia";
import { GlassCard } from './GlassCard';

export const Lootmeter = () => {
  const center = { x: 105, y: 100 };
  const radius = 80;

  const backgroundArc = React.useMemo(() => {
    try {
      const path = Skia.Path.Make();
      path.addArc(Skia.XYWHRect(center.x - radius, center.y - radius, radius * 2, radius * 2), 180, 180);
      return path;
    } catch {
      return null;
    }
  }, []);

  const activeArc = React.useMemo(() => {
    try {
      const path = Skia.Path.Make();
      path.addArc(Skia.XYWHRect(center.x - radius, center.y - radius, radius * 2, radius * 2), 180, 180 * 0.85);
      return path;
    } catch {
      return null;
    }
  }, []);

  if (!backgroundArc || !activeArc) {
    return (
      <GlassCard intensity={15} className="bg-slate-900 border-white/10 p-10 rounded-[40px] items-center justify-center">
         <Text className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Initializing Engine...</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard intensity={15} className="bg-slate-900 border-white/10 p-6 rounded-[40px]">
       <View className="items-center">
          <Text className="text-blue-400 font-bold uppercase tracking-[2px] text-[10px] mb-6">Action Engine Intelligence</Text>
          
          <View className="h-32 w-full items-center justify-center">
             <Canvas style={{ width: 210, height: 120 }}>
                <Path
                  path={backgroundArc}
                  color="#1e293b"
                  style="stroke"
                  strokeWidth={15}
                  strokeCap="round"
                />
                <Path
                  path={activeArc}
                  style="stroke"
                  strokeWidth={15}
                  strokeCap="round"
                >
                    <LinearGradient
                        start={vec(0, 100)}
                        end={vec(210, 100)}
                        colors={["#4F46E5", "#EF4444"]}
                    />
                </Path>
             </Canvas>
             <View className="absolute bottom-4 items-center">
                <Text className="text-white text-4xl font-black">8.5</Text>
                <Text className="text-red-500 font-black text-[10px] uppercase tracking-widest mt-1">Extreme Risk</Text>
             </View>
          </View>

          <View className="mt-4 bg-red-500/10 border border-red-500/20 p-4 rounded-3xl">
            <Text className="text-red-400 text-center text-xs font-bold leading-5">
               Detection Engine: High probability of phishing detected in recent UPI intent requests.
            </Text>
          </View>
       </View>
    </GlassCard>
  );
};
