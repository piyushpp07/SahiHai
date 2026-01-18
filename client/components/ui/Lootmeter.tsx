import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { GlassCard } from './GlassCard';

export const Lootmeter = () => {
  // SVG Calculations for a perfect semi-circle arc
  // M startX startY A radiusX radiusY xAxisRotation largeArcFlag sweepFlag endX endY
  const radius = 80;
  const strokeWidth = 16;
  const width = 200;
  const height = 110;
  
  // Background Arc (Gray track)
  const dBackground = "M 20 100 A 80 80 0 0 1 180 100";
  // Active Arc (Colored part - hardcoded for 85% for now as blueprint requirement)
  // For a partial arc, we can use strokeDasharray if needed, but a semi-circle is simple
  const dActive = "M 20 100 A 80 80 0 0 1 180 100";

  return (
    <GlassCard intensity={15} className="bg-slate-900 border-white/10 p-6 rounded-[40px]">
       <View className="items-center">
          <Text className="text-blue-400 font-bold uppercase tracking-[2px] text-[10px] mb-6">Action Engine Intelligence</Text>
          
          <View className="h-32 w-full items-center justify-center">
             <View style={{ width, height }}>
                <Svg width={width} height={height + 20} viewBox={`0 0 ${width} ${height + 20}`}>
                    <Defs>
                        <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#4F46E5" />
                            <Stop offset="100%" stopColor="#EF4444" />
                        </SvgGradient>
                    </Defs>
                    
                    {/* Background Track */}
                    <Path
                        d={dBackground}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    
                    {/* Active Progress */}
                    <Path
                        d={dActive}
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray="251" // Half of circumference (PI * 80)
                        strokeDashoffset="37"  // (1 - 0.85) * 251 = 37.65
                    />
                </Svg>
             </View>

             <View className="absolute bottom-4 items-center">
                <Text className="text-white text-2xl font-black">8.5</Text>
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
