import { Link, Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "~/components/common/Icons";
import {
  EditIcon,
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
            header: () => (
              <View
                style={{
                  height: 54,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                className="flex-row items-center justify-between bg-primary"
              >
                <View>
                  <Text className=" text-xl text-white">Explore</Text>
                </View>
                <View className="flex-row items-center gap-[10px]">
                  <UserGlobalPoints />
                  <Link href="/search" asChild>
                    <Button variant={"link"} className="m-0 p-0">
                      <Search className=" h-6 w-6 cursor-pointer stroke-white" />
                    </Button>
                  </Link>
                  <Link href="/create" asChild>
                    <Button variant={"link"} className="m-0 p-0">
                      <EditIcon className=" h-6 w-6 cursor-pointer stroke-white" />
                    </Button>
                  </Link>
                </View>
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
              fontSize: 20,
              fontWeight: "500",
            },
            headerStyle: {
              height: 54,
              paddingLeft: 15,
              paddingRight: 15,
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
              fontSize: 20,
              fontWeight: "500",
            },
            headerStyle: {
              height: 54,
              paddingLeft: 15,
              paddingRight: 15,
            },
            headerRight: () => (
              <View className="flex-row items-center gap-4 p-4">
                <UserWallets />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
