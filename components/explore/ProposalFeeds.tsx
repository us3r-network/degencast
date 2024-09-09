import { useEffect } from "react";
// import ChannelListWithCasts from "./ChannelListWithCasts";
import useLoadProposalFeeds from "~/hooks/explore/useLoadProposalFeeds";
import ChannelListWithCollectCasts from "./ChannelListWithCollectCasts";

export default function ProposalFeeds() {
  const { loadItems, loading, items } = useLoadProposalFeeds();
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <ChannelListWithCollectCasts
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
    />
  );
}
