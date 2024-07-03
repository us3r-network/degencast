import { usePrivy } from "@privy-io/react-auth";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultTabBar from "~/components/layout/material-top-tabs/TabBar";
import UserInfo from "~/components/portfolio/user/UserInfo";
import UserSignin from "~/components/portfolio/user/UserSignin";
import { Card } from "~/components/ui/card";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useAuth from "~/hooks/user/useAuth";
import MyCastsScreen from "./casts";
import MyChannelsScreen from "./channels";
import MyTokensScreen from "./tokens";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Tokens", value: "tokens", component: MyTokensScreen },
  { label: "Channels", value: "channels", component: MyChannelsScreen },
  { label: "Casts", value: "casts", component: MyCastsScreen },
];

export default function PortfolioScreen() {
  const { ready } = usePrivy();
  const { authenticated } = useAuth();
  const segments = useSegments();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: DEFAULT_HEADER_HEIGHT }}
      className="bg-background"
    >
      <View className="box-border w-full flex-1 px-4">
        <View className="relative mx-auto box-border w-full max-w-screen-sm flex-1">
          {ready &&
            (!authenticated ? (
              <Card className="flex h-full w-full items-center justify-center rounded-2xl">
                <UserSignin
                  onSuccess={() => {
                    console.log("login successful!");
                  }}
                  onFail={(error: unknown) => {
                    console.log("Failed to login", error);
                  }}
                />
              </Card>
            ) : (
              <View className="flex h-full w-full items-center gap-4 ">
                <View className="h-24 w-full">
                  <UserInfo />
                </View>
                <Card className="box-border h-full w-full rounded-[20px] rounded-b-none p-4 pb-0">
                  <Tab.Navigator
                    initialRouteName={segments?.[2]}
                    tabBar={(props) => <DefaultTabBar {...props} />}
                    sceneContainerStyle={{
                      backgroundColor: "white",
                      paddingTop: 15,
                    }}
                  >
                    {TABS.map((tab) => (
                      <Tab.Screen
                        key={tab.value}
                        name={tab.value}
                        component={tab.component}
                        options={{
                          title: tab.label,
                        }}
                      />
                    ))}
                  </Tab.Navigator>
                </Card>
              </View>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
