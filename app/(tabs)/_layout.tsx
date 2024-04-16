import { useTheme } from "@react-navigation/native";
import { Link, Tabs } from "expo-router";
import { Edit } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Search } from "~/components/common/Icons";
import {
  ExploreIcon,
  PortfolioIcon,
  TradeIcon,
} from "~/components/common/SvgIcons";
import TabBar from "~/components/layout/tabBar/TabBar";
import UserLogout from "~/components/portfolio/user/UserLogout";
import UserWallets from "~/components/portfolio/user/UserWallets";
import { Button } from "~/components/ui/button";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import { useColorScheme } from "~/lib/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  // console.log("colorScheme", theme);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
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
                <Button
                  className="size-10 rounded-full bg-white"
                >
                  <Search />
                </Button>
              </Link>
              <Link href="/create" asChild>
                <Button
                  className="size-10 rounded-full bg-white"
                >
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
              <UserLogout />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
