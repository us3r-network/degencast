import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider as ReduxProvider } from "react-redux";
import { PortalHost } from "~/components/primitives/portal";
import { privyConfig } from "~/config/privyConfig";
import { wagmiConfig } from "~/config/wagmiConfig";
import { PRIVY_APP_ID } from "~/constants";
import { store } from "~/store/store";

// Import global CSS file
import StateUpdateWrapper from "~/components/StateUpdateWrapper";
import "../global.css";
dayjs.extend(relativeTime);
global.Buffer = Buffer; //monkey patch for buffer in react-native

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
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
              <StateUpdateWrapper>
                <RootSiblingParent>
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                  <PortalHost />
                </RootSiblingParent>
              </StateUpdateWrapper>
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
    </ReduxProvider>
  );
}
