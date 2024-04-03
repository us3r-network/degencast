import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { Provider as ReduxProvider } from "react-redux";
import { PortalHost } from "~/components/primitives/portal";
import { privyConfig } from "~/config/privyConfig";
import { wagmiConfig } from "~/config/wagmiConfig";
import { PRIVY_APP_ID } from "~/constants";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { login } from "~/services/user/api";
import { store } from "~/store/store";
import { injectPrivyToken } from "~/utils/privy/injectToken";

// Import global CSS file
import "../global.css";
import StateUpdateWrapper from "~/components/StateUpdateWrapper";
dayjs.extend(relativeTime);
global.Buffer = Buffer; //monkey patch for buffer in react-native

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

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
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });

    injectPrivyToken();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  const queryClient = new QueryClient();
  return (
    <ReduxProvider store={store}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <PrivyProvider
          appId={PRIVY_APP_ID}
          config={{
            ...privyConfig,
            appearance: {
              theme: isDarkColorScheme ? "dark" : "light",
            },
          }}
          onSuccess={async (user, isNewUser) => {
            injectPrivyToken();
            login();
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
      </ThemeProvider>
    </ReduxProvider>
  );
}
