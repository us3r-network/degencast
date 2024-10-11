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

function CastPage({ jumpTo }: { jumpTo: (key: string) => void }) {
  return (
    <PageContent>
      <CastFeeds
        jumpTo={(key) => {
          jumpTo(key);
        }}
      />
    </PageContent>
  );
}

export default function ExploreLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "cast", title: "Explore" },
    { key: "vote", title: "Like" },
    { key: "collect", title: "Mint" },
  ]);

  const renderScene = SceneMap({
    cast: CastPage,
    vote: VotePage,
    collect: CollectPage,
  });

  return (
    <TabView
      lazy
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => <PageTabBar {...props} />}
    />
  );
}
