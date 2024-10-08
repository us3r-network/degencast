import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { createContext, useContext } from "react";
import { View } from "react-native";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { PRIMARY_COLOR } from "~/constants";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useAuth from "~/hooks/user/useAuth";
import UserChannelScreen from "./channel";
import UserFeedScreen from "./feed";
import MyWalletScreen from "./wallet";
import { PointLink } from "~/components/layout/header/HeaderLinks";
import { PortfolioSharingButton } from "~/components/platform-sharing/PlatformSharingButton";
import useUserCurationCasts from "~/hooks/user/useUserCurationCasts";
import LoginScreen from ".";

export default function PortfolioScreen() {
  const { ready, authenticated } = useAuth();
  return (
    <View className="flex-1">
      {ready && (!authenticated ? <LoginScreen /> : <UserScreen />)}
    </View>
  );
}

export type UserPortfolioProps = {
  fid: number;
};
export const UserPortfolioCtx = createContext<UserPortfolioProps | undefined>(
  undefined,
);
export const useUserPortfolioCtx = () => {
  const ctx = useContext(UserPortfolioCtx);
  if (!ctx) {
    throw new Error("useUserPortfolioCtx must be used within a provider");
  }
  return ctx;
};

function ChannelScreen() {
  const { fid } = useUserPortfolioCtx();
  return <UserChannelScreen fid={fid} />;
}

function FeedScreen() {
  const { fid } = useUserPortfolioCtx();
  return <UserFeedScreen fid={fid} />;
}

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Wallet", value: "wallet", component: MyWalletScreen },
  { label: "Channel", value: "channel", component: ChannelScreen },
  { label: "Feed", value: "feed", component: FeedScreen },
];

function UserScreen() {
  const { currFid } = useFarcasterAccount();
  const segments = useSegments();
  const { items, loading, load, hasMore } = useUserCurationCasts(currFid);
  return (
    <View className="h-full w-full pb-4">
      <UserPortfolioCtx.Provider value={{ fid: currFid || 0 }}>
        <Tab.Navigator
          initialRouteName={segments?.[0]}
          tabBar={(props) => (
            <View className="mb-4 flex gap-4">
              <PageTabBar
                {...props}
                renderRightContent={() => {
                  return (
                    <View className="flex flex-row items-center gap-[10px]">
                      <PointLink />
                      {currFid ? (
                        <PortfolioSharingButton
                          fid={currFid}
                          hasNfts={items.length > 0}
                        />
                      ) : null}
                    </View>
                  );
                }}
              />
              <PageContent className="h-24 flex-none">
                {currFid ? <UserInfo fid={currFid} viewerFid={currFid} /> : null}
              </PageContent>
            </View>
          )}
          style={{ width: "100%" }}
          sceneContainerStyle={{
            backgroundColor: PRIMARY_COLOR,
          }}
        >
          {TABS.map((tab) => {
            return (
              <Tab.Screen
                key={tab.value}
                name={tab.value}
                component={tab.component}
                options={{
                  title: tab.label,
                }}
              />
            );
          })}
        </Tab.Navigator>
      </UserPortfolioCtx.Provider>
    </View>
  );
}
