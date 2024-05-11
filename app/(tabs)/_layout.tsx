import { Link, Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "~/components/common/Icons";
import {
  ExploreIcon,
  PortfolioIcon,
  TradeIcon,
} from "~/components/common/SvgIcons";
import TabBar from "~/components/layout/tabBar/TabBar";
import UserWallets from "~/components/portfolio/user/UserWallets";
import { Button } from "~/components/ui/button";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import useCommunityRank from "~/hooks/trade/useCommunityRank";
// import useCommunityShares from "~/hooks/trade/useCommunityShares";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { Text } from "~/components/ui/text";
import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SKIP_ONBOARDING_KEY } from "../login";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";

export default function TabLayout() {
  // preload trade data
  useCommunityTokens();
  // useCommunityShares();
  useCommunityRank();
  const { ready, authenticated: privyAuthenticated } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    const goOnboarding = async () => {
      const skipOnboardingDate =
        await AsyncStorage.getItem(SKIP_ONBOARDING_KEY);
      if (
        ready &&
        !privyAuthenticated &&
        (!skipOnboardingDate || new Date(skipOnboardingDate) < new Date())
      )
        router.push("/login");
    };
    goOnboarding();
  }, [ready, privyAuthenticated]);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <Tabs
        screenOptions={{
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
        tabBar={(props) => {
          return <TabBar {...props} />;
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Explore",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <ExploreIcon fill={color} />,
            headerTransparent: true,
            headerTitleStyle: {
              color: "white",
            },
            headerRight: () => (
              <View className="mr-4 flex-row items-center gap-4">
                <Link href="/search" asChild>
                  <Button className="w-32 flex-row items-center justify-start gap-1 rounded-full bg-white/40">
                    <Search className=" h-4 w-4 stroke-white" />
                    <Text className=" text-base font-medium">Search</Text>
                  </Button>
                </Link>
                <Link href="/create" asChild>
                  <Button variant={"secondary"} size={"sm"}>
                    <Text className=" text-base font-medium">Cast</Text>
                  </Button>
                </Link>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="trade"
          options={{
            title: "Trade",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <TradeIcon fill={color} />,
            headerTransparent: true,
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <PortfolioIcon fill={color} />,
            headerTransparent: true,
            headerTitleStyle: {
              color: "white",
            },
            headerRight: () => (
              <View className="flex-row items-center gap-4 p-4">
                <UserGlobalPoints />
                <UserWallets />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
