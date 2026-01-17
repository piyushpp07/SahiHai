import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' } // Hiding tabs as per Bento Grid design
    }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}
