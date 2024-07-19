import { useEffect } from "react";
import ChannelListWithCasts from "./ChannelListWithCasts";
import useLoadCastFeeds from "~/hooks/explore/useLoadCastFeeds";

export default function CastFeeds() {
  const { loadItems, loading, items } = useLoadCastFeeds();
  useEffect(() => {
    loadItems();
  }, []);
  const showItems = items.map((item) => ({
    channel: item.channel,
    casts: item?.cast ? [{ cast: item.cast, proposal: item.proposal }] : [],
    tokenInfo: item.tokenInfo,
  }));
  return (
    <ChannelListWithCasts
      items={showItems}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
    />
  );
}
