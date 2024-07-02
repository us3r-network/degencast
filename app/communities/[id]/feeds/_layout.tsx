import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CastsScreen from "./casts";
import DefaultTabBar, {
  OutlineTabBar,
} from "~/components/layout/material-top-tabs/TabBar";
import OnchainScreen from "./onchain";

const initialRouteName = "casts";

const Tab = createMaterialTopTabNavigator();

export default function FeedsLayout() {
  const params = useLocalSearchParams();
  const { id: channelId } = params as { id: string };

  const { tipsRank, loadTipsRank } = useLoadCommunityTipsRank(channelId);
  useLoadCommunityCasts(channelId);

  useEffect(() => {
    if (tipsRank.length === 0) {
      loadTipsRank();
    }
  }, [tipsRank]);

  return (
    <View className="flex-1">
      <Tab.Navigator
        initialRouteName={initialRouteName}
        tabBar={(props) => <OutlineTabBar {...props} />}
        sceneContainerStyle={{
          backgroundColor: "white",
          paddingTop: 15,
        }}
      >
        <Tab.Screen
          name="casts"
          component={CastsScreen}
          options={{
            title: "Casts",
          }}
        />
        <Tab.Screen
          name="onchain"
          component={OnchainScreen}
          options={{
            title: "Onchain",
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
