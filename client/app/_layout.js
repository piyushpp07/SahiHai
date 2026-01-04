import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "./components/CustomDrawer";
import { COLORS } from "./constants/colors";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.ACCENT },
          headerTintColor: COLORS.WHITE,
          headerTitleAlign: "center",
          headerTitle: "SahiHai",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            letterSpacing: 1,
            color: COLORS.WHITE,
          },
          drawerStyle: {
            backgroundColor: COLORS.BG_SECONDARY,
            width: "75%",
          },
          drawerActiveTintColor: COLORS.ACCENT,
          drawerInactiveTintColor: COLORS.TEXT_SECONDARY,
          drawerLabelStyle: {
            marginLeft: -16,
            fontSize: 16,
            fontWeight: "500",
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "SahiHai",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
