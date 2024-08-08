import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import CastFeeds from "~/components/explore/CastFeeds";
import ProposalFeeds from "~/components/explore/ProposalFeeds";
import SelectionFeeds from "~/components/explore/SelectionFeeds";
import { PageContent } from "~/components/layout/content/Content";
import PageTabBar from "~/components/layout/tab-view/PageTabBar";

function SelectionPage() {
  return (
    <PageContent>
      <SelectionFeeds />
    </PageContent>
  );
}

function ProposalPage() {
  return (
    <PageContent>
      <ProposalFeeds />
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
    { key: "selection", title: "Selection" },
    { key: "proposal", title: "Proposal" },
  ]);

  const renderScene = SceneMap({
    selection: SelectionPage,
    proposal: ProposalPage,
    cast: CastPage,
  });

  return (
    <TabView
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={PageTabBar}
    />
  );
}
