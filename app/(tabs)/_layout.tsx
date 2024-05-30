import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExploreIcon,
  PortfolioIcon,
  TradeIcon,
} from "~/components/common/SvgIcons";
import TabBar from "~/components/layout/tabBar/TabBar";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import useCommunityRank from "~/hooks/trade/useCommunityRank";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { usePrivy } from "@privy-io/react-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SKIP_ONBOARDING_KEY } from "../login";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import {
  ExploreSharingButton,
  PortfolioSharingButton,
  TradeSharingButton,
} from "~/components/platform-sharing/PlatformSharingButton";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import {
  Header,
  HeaderLeft,
  HeaderRight,
} from "~/components/layout/header/Header";
import { PostLink, SearchLink } from "~/components/layout/header/HeaderLinks";
import ScreenFirstLoading from "~/components/layout/ScreenFirstLoading";
import useFirstLoadedScreenListener from "~/hooks/useFirstLoadedScreenListener";

export default function TabLayout() {
  const { currFid, farcasterAccount } = useFarcasterAccount();
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

  const { routeFirstLoadedListener } = useFirstLoadedScreenListener();
  useEffect(() => {
    routeFirstLoadedListener();
  }, [routeFirstLoadedListener]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <Tabs
        screenOptions={{
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
        tabBar={(props) => {
          return (
            <>
              <TabBar {...props} />
              <ScreenFirstLoading />
            </>
          );
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
              <Header>
                <HeaderLeft title="Explore" />
                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  <PostLink />
                  <View>
                    <ExploreSharingButton fid={currFid} />
                  </View>
                </HeaderRight>
              </Header>
            ),
          }}
        />
        <Tabs.Screen
          name="channels"
          options={{
            title: "Channels",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <TradeIcon fill={color} />,
            headerTransparent: true,
            headerStyle: {
              height: 54,
            },
            header: () => (
              <Header>
                <HeaderLeft title="Channels" />
                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  <PostLink />
                  <View>
                    <TradeSharingButton fid={currFid} />
                  </View>
                </HeaderRight>
              </Header>
            ),
          }}
        />
        <Tabs.Screen
          name="portfolio"
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
                <HeaderLeft title="Portfolio" />
                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  <PostLink />
                  {currFid && farcasterAccount && <View>
                    <PortfolioSharingButton
                      fid={Number(currFid)}
                      fname={farcasterAccount.username || ""}
                    />
                  </View>}
                </HeaderRight>
              </Header>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
