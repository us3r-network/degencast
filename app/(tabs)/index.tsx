import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import CastFeeds from "~/components/explore/CastFeeds";
import ProposalFeeds from "~/components/explore/ProposalFeeds";
import SelectionFeeds from "~/components/explore/SelectionFeeds";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/tab-view/PageTabBar";

function CollectPage() {
  return (
    <PageContent>
      <SelectionFeeds />
    </PageContent>
  );
}

function VotePage({ jumpTo }: { jumpTo: (key: string) => void }) {
  return (
    <PageContent>
      <ProposalFeeds
        navigateToCasts={() => {
          jumpTo("cast");
        }}
      />
    </PageContent>
  );
}

function CastPage() {
  return (
    <PageContent>
      <CastFeeds />
    </PageContent>
  );
}

export default function ExploreLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "cast", title: "Cast" },
    { key: "collect", title: "Collect" },
    { key: "vote", title: "Vote" },
  ]);

  const renderScene = SceneMap({
    collect: CollectPage,
    vote: VotePage,
    cast: CastPage,
  });

  return (
    <TabView
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => <PageTabBar {...props} />}
    />
  );
}
