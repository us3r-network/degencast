import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserPortfolioCtx,
  useUserPortfolioCtx,
} from "~/app/(tabs)/portfolio/_layout";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { PRIMARY_COLOR } from "~/constants";
import UserChannelScreen from "./channel";
import UserFeedScreen from "./feed";
import UserWalletScreen from "./wallet";

function WalletScreen() {
  const { fid } = useUserPortfolioCtx();
  return <UserWalletScreen fid={fid} />;
}

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
  { label: "Wallet", value: "wallet", component: WalletScreen },
  { label: "Channel", value: "channel", component: ChannelScreen },
  { label: "Feed", value: "feed", component: FeedScreen },
];

export default function UserPortfolioScreen() {
  const segments = useSegments();
  const { fid } = useLocalSearchParams<{ fid: string }>();

  console.log("UserPortfolioScreen", fid);
  if (Number(fid))
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: PRIMARY_COLOR,
        }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <UserPortfolioCtx.Provider value={{ fid: Number(fid) || 0 }}>
          <Tab.Navigator
            initialRouteName={segments?.[0]}
            tabBar={(props) => (
              <View className="mb-4 flex gap-4">
                <PageTabBar {...props} level={1} />
                <PageContent className="h-24 flex-none">
                  <UserInfo fid={Number(fid)} />
                </PageContent>
              </View>
            )}
            sceneContainerStyle={{
              backgroundColor: PRIMARY_COLOR,
              paddingBottom: 16,
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
      </SafeAreaView>
    );
}
