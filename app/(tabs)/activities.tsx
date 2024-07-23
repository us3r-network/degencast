import { View } from "react-native";
import { PropsWithChildren, useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import AllActivities from "~/components/activity/Activities";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/tab-view/PageTabBar";
import UserSignin from "~/components/portfolio/user/UserSignin";
import { OnchainActivityFilterType } from "~/hooks/activity/useLoadOnchainActivities";
import useAuth from "~/hooks/user/useAuth";

function ActivitiesPageContent({ children }: PropsWithChildren) {
  return <PageContent>{children}</PageContent>;
}

function AllActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <AllActivities />
    </ActivitiesPageContent>
  );
}
function MyActivitiesPage() {
  const { ready, authenticated } = useAuth();
  if (!ready) {
    return null;
  }
  return (
    <ActivitiesPageContent>
      {authenticated ? (
        <AllActivities type={OnchainActivityFilterType.MINE} />
      ) : (
        <View className="flex h-full w-full items-center justify-center">
          <View>
            <UserSignin
              onSuccess={() => {}}
              onFail={(error) => {
                console.error(error);
              }}
            />
          </View>
        </View>
      )}
    </ActivitiesPageContent>
  );
}
/*
function PowerusersActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <AllActivities type={OnchainActivityFilterType.POWERUSERS} />
    </ActivitiesPageContent>
  );
}
function FollowingActivitiesPage() {
  return (
    <ActivitiesPageContent>
      <AllActivities type={OnchainActivityFilterType.FOLLOWING} />
    </ActivitiesPageContent>
  );
}
*/
export default function ActivitiesLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "Global activities" },
    { key: "mine", title: "My activities" },
    // { key: "powerusers", title: "Powerusers" },
    // { key: "following", title: "Following" },
  ]);
  const renderScene = SceneMap({
    all: AllActivitiesPage,
    mine: MyActivitiesPage,
    // powerusers: PowerusersActivitiesPage,
    // following: FollowingActivitiesPage,
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
