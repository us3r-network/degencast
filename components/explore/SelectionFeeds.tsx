import { useEffect } from "react";
import useLoadSelectionFeeds from "~/hooks/explore/useLoadSelectionFeeds";
import ChannelListWithCollectCasts from "./ChannelListWithCollectCasts";

export default function SelectionFeeds() {
  const { loadItems, loading, items } = useLoadSelectionFeeds();
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
