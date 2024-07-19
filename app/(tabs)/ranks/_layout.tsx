import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { View } from "react-native";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import { PRIMARY_COLOR } from "~/constants";
import ChannelsScreen from "./channels";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Channels", value: "channels", component: ChannelsScreen },
  { label: "Curators", value: "curators", component: ChannelsScreen },
  { label: "Tokens", value: "cokens", component: ChannelsScreen },
];

export default function PortfolioScreen() {
  const segments = useSegments();
  return (
    <View className="flex-1 pb-4">
      <Tab.Navigator
        initialRouteName={segments?.[0]}
        tabBar={PageTabBar}
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
    </View>
  );
}
