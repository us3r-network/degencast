import { PropsWithChildren, useState } from "react";
import { TabView, SceneMap } from "react-native-tab-view";
import AllActivities from "~/components/activity/All";
import FollowingActivities from "~/components/activity/Following";
import PowerusersActivities from "~/components/activity/Powerusers";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/tab-view/PageTabBar";
import { Card, CardContent } from "~/components/ui/card";

function ActivitiesPageContent({ children }: PropsWithChildren) {
  return (
    <PageContent>
      <Card className="h-full w-full rounded-2xl rounded-b-none p-4 pb-0">
        <CardContent className="h-full w-full p-0">{children}</CardContent>
      </Card>
    </PageContent>
  );
}

function AllActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <AllActivities />
    </ActivitiesPageContent>
  );
}

function PowerusersActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <PowerusersActivities />
    </ActivitiesPageContent>
  );
}

function FollowingActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <FollowingActivities />
    </ActivitiesPageContent>
  );
}

export default function ActivitiesLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "All" },
    { key: "powerusers", title: "Powerusers" },
    { key: "following", title: "Following" },
  ]);
  const renderScene = SceneMap({
    all: AllActivitiesPage,
    powerusers: PowerusersActivitiesPage,
    following: FollowingActivitiesPage,
  });
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => <PageTabBar {...props} />}
    />
  );
}
