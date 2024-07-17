import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import FollowingScreen from "~/components/explore/following";
import TrendingChannels from "~/components/explore/TrendingChannels";
import PageTabBar from "~/components/layout/tab-view/PageTabBar";

export default function ExploreLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "trending", title: "Trending" },
    { key: "following", title: "Following" },
  ]);

  const renderScene = SceneMap({
    trending: TrendingChannels,
    following: FollowingScreen,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={PageTabBar}
    />
  );
}
