import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { PRIMARY_COLOR } from "~/constants";
import CastsScreen from "./casts";
import ChannelsScreen from "./channels";
import WalletsScreen from "./wallets";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Wallets", value: "wallets", component: WalletsScreen },
  { label: "Channels", value: "channels", component: ChannelsScreen },
  { label: "Casts", value: "casts", component: CastsScreen },
];

export default function UserPortfolioScreen() {
  const segments = useSegments();
  const { fid } = useLocalSearchParams<{ fid: string }>();

  if (Number(fid))
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Stack.Screen options={{ headerShown: false }} />
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
              const Component = tab.component;
              return (
                <Tab.Screen
                  key={tab.value}
                  name={tab.value}
                  component={() => <Component fid={Number(fid)!} />}
                  options={{
                    title: tab.label,
                  }}
                />
              );
            })}
          </Tab.Navigator>
      </SafeAreaView>
    );
}
