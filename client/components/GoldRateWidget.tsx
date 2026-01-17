import { View, Text } from 'react-native';
import { SkeletonLoader } from './ui/SkeletonLoader';
import { useGoldRates } from '../hooks/useGoldRates';

export const GoldRateWidget = () => {
    const { data, isLoading } = useGoldRates();

    if (isLoading) {
        return <SkeletonLoader height={100} />;
    }

    if (!data) return null;

    return (
        <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <Text className="text-yellow-800 font-bold text-lg mb-2">Today&apos;s Gold Rates (10g)</Text>
            <View className="flex-row justify-between">
                <View>
                    <Text className="text-gray-500 text-xs">24K Pure</Text>
                    <Text className="text-xl font-semibold">₹{data.gold24k.toLocaleString()}</Text>
                </View>
                <View>
                    <Text className="text-gray-500 text-xs">22K Standard</Text>
                    <Text className="text-xl font-semibold">₹{data.gold22k.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
}
