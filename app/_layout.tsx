import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioProvider from "@/components/AudioProvider";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AudioProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              headerTransparent: true,
              headerTitle: "",
            }}
          />
        </Stack>
      </AudioProvider>
    </ThemeProvider>
  );
}
