import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import Toast, { ToastConfigParams } from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";
import StateUpdateWrapper from "~/components/StateUpdateWrapper";
import { PortalHost } from "~/components/primitives/portal";
import { Text } from "~/components/ui/text";
import { privyConfig } from "~/config/privyConfig";
import { wagmiConfig } from "~/config/wagmiConfig";
import { PRIVY_APP_ID } from "~/constants";
import { store } from "~/store/store";
import { getInstallPrompter } from "~/utils/pwa";
// Import global CSS file
import "../global.css";

dayjs.extend(relativeTime);
global.Buffer = Buffer; //monkey patch for buffer in react-native

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const toastConfig = {
  postToast: ({
    props,
  }: ToastConfigParams<{
    hash: string;
    fid: string;
  }>) => (
    <View className="flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">Cast created successfully!</Text>
      <Link href={`/casts/${props.hash}?fid=${props.fid}`}>
        <Text className="font-bold text-primary">View</Text>
      </Link>
    </View>
  ),
  success: ({ text1 }: ToastConfigParams<{}>) => (
    <View className=" z-50 flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">{text1}</Text>
    </View>
  ),
  error: ({ text1 }: ToastConfigParams<{}>) => (
    <View className="z-50 flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">{text1}</Text>
    </View>
  ),
  info: ({ text1 }: ToastConfigParams<{}>) => (
    <View className="z-50 flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">{text1}</Text>
    </View>
  ),
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
        getInstallPrompter();
      }
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);
  const queryClient = new QueryClient();
  return (
    <ReduxProvider store={store}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          ...privyConfig,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <StateUpdateWrapper />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <PortalHost />
            <View
              id="dialog-container"
              className="pointer-events-none absolute h-full w-full"
            />
            <Toast config={toastConfig} />
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ReduxProvider>
  );
}
