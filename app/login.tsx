import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { Onboarding } from "~/components/portfolio/user/Onboarding";

export const SKIP_ONBOARDING_KEY = "skipOnboarding";
export default function LoginScreen() {
  return (
    <SafeAreaView className="h-full">
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Onboarding />
    </SafeAreaView>
  );
}
