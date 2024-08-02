import { createContext, useContext, useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import { OutlineTabBar } from "~/components/layout/tab-view/TabBar";
import ChannelList from "~/components/portfolio/channels/UserChannels";
import { UserCurationCastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { UserChannelsType } from "~/features/user/userChannelsSlice";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

export type UserChannelsProps = {
  fid: number;
};

const UserChannelsCtx = createContext<UserChannelsProps | undefined>(undefined);
const useUserChannelsCtx = () => {
  const ctx = useContext(UserChannelsCtx);
  if (!ctx) {
    throw new Error("useUserChannelsCtx must be used within a provider");
  }
  return ctx;
};

function FollowingChannelsScene() {
  const { fid } = useUserChannelsCtx();
  return (
    <CardWarper>
      <ChannelList fid={fid} type={UserChannelsType.FOLLOWING} />
    </CardWarper>
  );
}

function HoldingChannelsScene() {
  const { fid } = useUserChannelsCtx();
  return (
    <CardWarper>
      <ChannelList fid={fid} type={UserChannelsType.HOLDING} />
    </CardWarper>
  );
}

export default function UserChannelsScreen({ fid }: { fid?: number }) {
  const { currFid } = useFarcasterAccount();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "holding", title: "Holding" },
    { key: "following", title: "Following" },
  ]);
  const renderScene = SceneMap({
    following: FollowingChannelsScene,
    holding: HoldingChannelsScene,
  });
  return (
    <PageContent>
      {currFid ? (
        <UserChannelsCtx.Provider value={{ fid: fid || currFid || 0 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={OutlineTabBar}
          />
        </UserChannelsCtx.Provider>
      ) : (
        <LinkFarcaster />
      )}
    </PageContent>
  );
}
