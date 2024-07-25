import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { PageContent } from "~/components/layout/content/Content";
import { OutlineTabBar } from "~/components/layout/tab-view/TabBar";
import {
  UserCastList,
  UserCurationCastList,
} from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

function CurationFeedsPage({ fid }: { fid: number }) {
  return <UserCurationCastList fid={fid} />;
}

function CastsFeedsPage({ fid }: { fid: number }) {
  return <UserCastList fid={fid} />;
}

export default function MyCastsScreen({ fid }: { fid?: number }) {
  const { currFid } = useFarcasterAccount();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "casts", title: "Casts" },
    { key: "curation", title: "Curation" },
  ]);
  const renderScene = SceneMap({
    curation: () => <CurationFeedsPage fid={fid || currFid || 0} />,
    casts: () => <CastsFeedsPage fid={fid || currFid || 0} />,
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
