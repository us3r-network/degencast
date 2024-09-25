import { createContext, useContext, useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { PageContent } from "~/components/layout/content/Content";
import { OutlineTabBar } from "~/components/layout/tab-view/TabBar";
import {
  UserCastList,
  UserCurationCastList,
} from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

export type MyCastsProps = {
  fid: number;
};

const MyCastsCtx = createContext<MyCastsProps | undefined>(undefined);
const useMyCastsCtx = () => {
  const ctx = useContext(MyCastsCtx);
  if (!ctx) {
    throw new Error("useMyCastsCtx must be used within a provider");
  }
  return ctx;
};

function CurationFeedsScene() {
  const { fid } = useMyCastsCtx();
  return <UserCurationCastList fid={fid} />;
}

function MyCastsFeedsScene() {
  const { fid } = useMyCastsCtx();
  return <UserCastList fid={fid} />;
}

export default function UserFeedScreen({ fid }: MyCastsProps) {
  const { currFid } = useFarcasterAccount();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "casts", title: "Casts" },
    { key: "curation", title: "Contributions" },
  ]);
  const renderScene = SceneMap({
    curation: CurationFeedsScene,
    casts: MyCastsFeedsScene,
  });
  return (
    <PageContent>
      {fid || currFid ? (
        <MyCastsCtx.Provider value={{ fid: fid || currFid || 0 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={OutlineTabBar}
          />
        </MyCastsCtx.Provider>
      ) : (
        <LinkFarcaster />
      )}
    </PageContent>
  );
}
