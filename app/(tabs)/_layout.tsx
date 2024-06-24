import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExploreIcon,
  PortfolioIcon,
  TradeIcon,
} from "~/components/common/SvgIcons";
import ExploreViewSelect from "~/components/explore/ExploreSelect";
import {
  Header,
  HeaderLeft,
  HeaderLeftDefault,
  HeaderLogo,
  HeaderRight,
} from "~/components/layout/header/Header";
import { PostLink, SearchLink } from "~/components/layout/header/HeaderLinks";
import TabBar from "~/components/layout/tabBar/TabBar";
import {
  ExploreSharingButton,
  PortfolioSharingButton,
  TradeSharingButton,
} from "~/components/platform-sharing/PlatformSharingButton";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import OnboardingModal from "~/components/portfolio/user/Onboarding";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import useCommunityRank from "~/hooks/rank/useCommunityRank";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useCommunityTokens from "~/hooks/trade/useCommunityTokens";
import { logGA } from "~/utils/firebase/analytics.web";

export default function TabLayout() {
  const { currFid, farcasterAccount } = useFarcasterAccount();
  // preload data
  useCommunityTokens();
  useCommunityRank();
  useEffect(() => {
    logGA("app_open", {});
  }, []);
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
            title: "Channels",
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color }) => <ExploreIcon fill={color} />,
            headerTransparent: true,
            header: () => (
              <Header>
                <HeaderLeft>
                  <HeaderLogo />
                  <ExploreViewSelect />
                </HeaderLeft>

                <HeaderRight>
                  <UserGlobalPoints />
                  <SearchLink />
                  {/* <PostLink />
                  <View>
                    <ExploreSharingButton fid={currFid} />
                  </View> */}
                </HeaderRight>
              </Header>
            ),
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
      <OnboardingModal />
    </SafeAreaView>
  );
}
