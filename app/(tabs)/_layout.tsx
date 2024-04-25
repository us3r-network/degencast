import { Link, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Edit } from "~/components/common/Icons";
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
import useCommunityShares from "~/hooks/trade/useCommunityShares";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";

export default function TabLayout() {
  // preload trade data
  useCommunityTokens();
  useCommunityShares();
  useCommunityRank();
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
                  <Button size={"icon"} className="rounded-full bg-white">
                    <Search />
                  </Button>
                </Link>
                <Link href="/create" asChild>
                  <Button size={"icon"} className="rounded-full bg-white">
                    <Edit />
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
                <UserWallets />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
