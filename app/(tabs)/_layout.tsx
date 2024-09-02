import { Tabs, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIcon,
  ExploreIcon,
  PortfolioIcon,
  TradeIcon,
} from "~/components/common/SvgIcons";
import TabBar from "~/components/layout/tabBar/TabBar";
import { PRIMARY_COLOR } from "~/constants";
import useChannelRank from "~/hooks/rank/useChannelRank";
import useCuratorRank from "~/hooks/rank/useCuratorRank";
import useTokenRank from "~/hooks/rank/useTokenRank";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import useAuth from "~/hooks/user/useAuth";
import { logGA } from "~/utils/firebase/analytics.web";

const AUTH_PROTECTED_ROUTES = ["portfolio"];
export default function TabLayout() {
  useCommunityTokens();
  // useChannelRank();
  // useCuratorRank();
  // useTokenRank();
  useEffect(() => {
    if (Platform.OS === "web") logGA("app_open", {});
  }, []);
  const { ready, authenticated, login } = useAuth();
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
      }}
    >
      <Tabs
        screenOptions={{ headerShown: false }}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenListeners={{
          // Monitor tab press and if 'portfolio' tab is pressed
          tabPress: (e: any) => {
            AUTH_PROTECTED_ROUTES.forEach((route) => {
              if ((e.target as string).startsWith(route)) {
                if (!ready) return;
                if (!authenticated) {
                  e.preventDefault();
                  login({
                    onSuccess: () => {
                      console.log("login successful!");
                      navigation.navigate(route as never);
                    },
                    onFail: () => {
                      console.log("Failed to login");
                    },
                  });
                }
              }
            });
          },
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Feeds",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <ExploreIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="ranks"
          options={{
            title: "Ranks",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <TradeIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="activities"
          options={{
            title: "Activities",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <ActivityIcon stroke={color} />,
          }}
        />
        <Tabs.Screen
          name={`portfolio${Platform.OS === "web" ? "" : "/index"}`}
          options={{
            title: authenticated ? "Portfolio" : "Login",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <PortfolioIcon fill={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
