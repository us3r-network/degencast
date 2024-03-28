import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { Buffer } from "buffer";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { PRIVY_APP_ID } from "~/constants";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { store } from "~/store/store";

// Import global CSS file
import "../global.css";
import { PrivyProvider } from "@privy-io/react-auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { PortalHost } from "~/components/primitives/portal";

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
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <PrivyProvider
          appId={PRIVY_APP_ID}
          config={{
            // Customize Privy's appearance in your app
            appearance: {
              theme: isDarkColorScheme ? "dark" : "light",
              accentColor: "#676FFF",
              logo: "https://u3.xyz/logo192.png",
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
            loginMethodsAndOrder: {
              primary: [
                "farcaster",
                "twitter",
                "detected_wallets",
                "metamask",
                "coinbase_wallet",
                "rainbow",
              ],
            },
          }}
          onSuccess={(user, isNewUser) => {
            console.log("Logged in!", user, isNewUser);
          }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
          </Stack>
          <PortalHost />
        </PrivyProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
