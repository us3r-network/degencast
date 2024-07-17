import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import { OutlineTabBar } from "~/components/layout/tab-view/TabBar";
import { CastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

function CurationFeedsPage({ fid }: { fid: number }) {
  return (
    <CardWarper className="mt-4">
      <CastList fid={fid} />
    </CardWarper>
  );
}

function CastsFeedsPage({ fid }: { fid: number }) {
  return (
    <CardWarper className="mt-4">
      <CastList fid={fid} />
    </CardWarper>
  );
}

export default function MyCastsScreen() {
  const { currFid } = useFarcasterAccount();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "casts", title: "Casts" },
    { key: "curation", title: "Curation" },
  ]);
  const renderScene = SceneMap({
    curation: () => <CurationFeedsPage fid={currFid || 0} />,
    casts: () => <CastsFeedsPage fid={currFid || 0} />,
  });
  return (
    <PageContent>
      {currFid ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={OutlineTabBar}
        />
      ) : (
        <LinkFarcaster />
      )}
    </PageContent>
  );
}
