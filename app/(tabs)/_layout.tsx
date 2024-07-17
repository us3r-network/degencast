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
import {
  Header,
  HeaderLeftDefault,
  HeaderRight,
} from "~/components/layout/header/Header";
import { SearchLink } from "~/components/layout/header/HeaderLinks";
import TabBar from "~/components/layout/tabBar/TabBar";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import useCommunityRank from "~/hooks/rank/useCommunityRank";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import useAuth from "~/hooks/user/useAuth";
import { logGA } from "~/utils/firebase/analytics.web";

const AUTH_PROTECTED_ROUTES = ["portfolio"];
export default function TabLayout() {
  useCommunityTokens();
  useCommunityRank();
  useEffect(() => {
    if (Platform.OS === "web") logGA("app_open", {});
  }, []);
  const { authenticated, login } = useAuth();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <Tabs
        screenOptions={{ headerShown: useClientOnlyValue(false, true) }}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        screenListeners={{
          // Monitor tab press and if 'portfolio' tab is pressed
          tabPress: (e: any) => {
            console.log("tabPress", e);
            AUTH_PROTECTED_ROUTES.forEach((route) => {
              if ((e.target as string).startsWith(route)) {
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
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="ranks"
          options={{
            title: "Ranks",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <TradeIcon fill={color} />,
            headerTransparent: true,
            headerStyle: {
              height: 54,
            },
            header: () => (
              <Header>
                <HeaderLeftDefault title="Ranks" />
                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  {/* <PostLink />
                  <View>
                    <TradeSharingButton fid={currFid} />
                  </View> */}
                </HeaderRight>
              </Header>
            ),
          }}
        />
        <Tabs.Screen
          name="activities"
          options={{
            title: "Activities",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <ActivityIcon stroke={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name={`portfolio${Platform.OS === "web" ? "" : "/index"}`}
          options={{
            title: "Portfolio",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <PortfolioIcon fill={color} />,
            headerTransparent: true,
            headerStyle: {
              height: 54,
            },
            header: () => (
              <Header>
                <HeaderLeftDefault title="Portfolio" />
                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  {/* <PostLink />
                  {currFid && farcasterAccount && (
                    <View>
                      <PortfolioSharingButton
                        fid={Number(currFid)}
                        fname={farcasterAccount.username || ""}
                      />
                    </View>
                  )} */}
                </HeaderRight>
              </Header>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
