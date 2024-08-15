import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { View } from "react-native";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import UserInfo from "~/components/portfolio/user/UserInfo";
import UserSignin from "~/components/portfolio/user/UserSignin";
import { PRIMARY_COLOR } from "~/constants";
import useAuth from "~/hooks/user/useAuth";
import CastsScreen from "./casts";
import ChannelsScreen from "./channels";
import WalletsScreen from "./wallets";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Wallet", value: "wallets", component: WalletsScreen },
  { label: "Channel", value: "channels", component: ChannelsScreen },
  { label: "Feed ", value: "casts", component: CastsScreen },
];

export default function PortfolioScreen() {
  const { ready, authenticated } = useAuth();
  const { currFid } = useFarcasterAccount();
  const segments = useSegments();
  return (
    <View className="flex-1">
      {ready &&
        (!authenticated ? (
          <View className="flex h-full items-center justify-center">
            <View>
              <UserSignin
                onSuccess={() => {
                  console.log("login successful!");
                }}
                onFail={(error: unknown) => {
                  console.log("Failed to login", error);
                }}
              />
            </View>
          </View>
        ) : (
          <View className="h-full w-full pb-4">
            <Tab.Navigator
              initialRouteName={segments?.[0]}
              tabBar={(props) => (
                <View className="mb-4 flex gap-4">
                  <PageTabBar {...props} />
                  <PageContent className="h-24 flex-none">
                    <UserInfo />
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
                    component={() => tab.component({ fid: currFid || 0 })}
                    options={{
                      title: tab.label,
                    }}
                  />
                );
              })}
            </Tab.Navigator>
          </View>
        ))}
    </View>
  );
}
