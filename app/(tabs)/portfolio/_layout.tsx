import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import UserSignin from "~/components/portfolio/user/UserSignin";
import { PRIMERY_COLOR } from "~/constants";
import useAuth from "~/hooks/user/useAuth";
import MyCastsScreen from "./casts";
import MyChannelsScreen from "./channels";
import WalletsScreen from "./wallets";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Wallets", value: "tokens", component: WalletsScreen },
  { label: "Channels", value: "channels", component: MyChannelsScreen },
  { label: "Casts", value: "casts", component: MyCastsScreen },
];

export default function PortfolioScreen() {
  const { ready, authenticated } = useAuth();
  const segments = useSegments();
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
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
          <View className="flex h-full w-full items-center gap-4 ">
            <Tab.Navigator
              initialRouteName={segments?.[0]}
              tabBar={(props) => <PageTabBar {...props} />}
              style={{ width: "100%" }}
              sceneContainerStyle={{
                backgroundColor: PRIMERY_COLOR,
              }}
            >
              {TABS.map((tab) => {
                const PageContent = tab.component;
                return (
                  <Tab.Screen
                    key={tab.value}
                    name={tab.value}
                    component={PageContent}
                    options={{
                      title: tab.label,
                    }}
                  />
                );
              })}
            </Tab.Navigator>
          </View>
        ))}
    </SafeAreaView>
  );
}
