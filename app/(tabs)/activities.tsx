import { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import AllActivities from "~/components/activity/All";
import FollowingActivities from "~/components/activity/Following";
import PowerusersActivities from "~/components/activity/Powerusers";
import DefaultTabBar from "~/components/layout/tab-view/TabBar";
import { Card, CardContent } from "~/components/ui/card";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";

const renderScene = SceneMap({
  all: () => <AllActivities />,
  powerusers: () => <PowerusersActivities />,
  following: () => <FollowingActivities />,
});

const routes = [
  { key: "all", title: "All" },
  { key: "powerusers", title: "Powerusers" },
  { key: "following", title: "Following" },
];

export default function ActivitiesLayout() {
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaView
      style={{ paddingTop: DEFAULT_HEADER_HEIGHT }}
      className="flex-1 bg-background"
    >
      <View className="box-border w-full flex-1 px-4">
        <Card className="relative mx-auto box-border h-full w-full max-w-screen-sm rounded-2xl p-2">
          <CardContent className="h-full w-full p-0">
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={DefaultTabBar}
            />
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
