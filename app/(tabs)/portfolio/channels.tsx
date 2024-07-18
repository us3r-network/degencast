import { useState } from "react";
import { SceneMap, TabView } from "react-native-tab-view";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import { OutlineTabBar } from "~/components/layout/tab-view/TabBar";
import ChannelList from "~/components/portfolio/channels/UserChannels";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { UserChannelsType } from "~/features/user/userChannelsSlice";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

function FollowingChannelsPage({ fid }: { fid: number }) {
  return (
    <CardWarper className="mt-4">
      <ChannelList fid={fid} type={UserChannelsType.FOLLOWING} />
    </CardWarper>
  );
}

function HoldingChannelsPage({ fid }: { fid: number }) {
  return (
    <CardWarper className="mt-4">
      <ChannelList fid={fid} type={UserChannelsType.HOLDING} />
    </CardWarper>
  );
}

export default function MyChannelsScreen() {
  const { currFid } = useFarcasterAccount();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "holding", title: "Holding" },
    { key: "following", title: "Following" },
  ]);
  const renderScene = SceneMap({
    following: () => <FollowingChannelsPage fid={currFid || 0} />,
    holding: () => <HoldingChannelsPage fid={currFid || 0} />,
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
