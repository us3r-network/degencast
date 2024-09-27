import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";

import { PrivyProvider, WagmiProvider } from "~/lib/privy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import StateUpdateWrapper from "~/components/StateUpdateWrapper";
import { PortalHost } from "@rn-primitives/portal";
import { privyConfig } from "~/config/privyConfig";
import { wagmiConfig } from "~/config/wagmiConfig";
import { PRIVY_APP_ID } from "~/constants";
import { store } from "~/store/store";
import { getInstallPrompter } from "~/utils/pwa";
// Import global CSS file
import "../global.css";
import { Buffer } from "buffer";
import GlobalModals from "~/components/GlobalModals";
import Toast from "~/components/Toast";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
// TODO 运行app模式可能会报错，注意处理兼容性问题
global.Buffer = Buffer;

if (Platform.OS !== "web") {
  Object.assign(window, {
    addEventListener: () => 0,
    removeEventListener: () => {},
    dispatchEvent: () => true,
    CustomEvent: class CustomEvent {} as any,
  });
}

dayjs.extend(relativeTime);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
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
        document.getElementById("degencast-loading")?.remove();
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
        <SmartWalletsProvider>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
              <StateUpdateWrapper />
              <GlobalModals />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <PortalHost />
              <Toast />
            </WagmiProvider>
          </QueryClientProvider>
        </SmartWalletsProvider>
      </PrivyProvider>
    </ReduxProvider>
  );
}
