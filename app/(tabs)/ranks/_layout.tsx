import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSegments } from "expo-router";
import { View } from "react-native";
import PageTabBar from "~/components/layout/material-top-tabs/PageTabBar";
import { PRIMARY_COLOR } from "~/constants";
import ChannelsScreen from "./channels";
import CuratorsScreen from "./curators";
// import TokensScreen from "./tokens";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Channels", value: "channels", component: ChannelsScreen },
  { label: "DegenCaster", value: "curators", component: CuratorsScreen },
  // { label: "Tokens", value: "tokens", component: TokensScreen },
];

export default function RankScreen() {
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
