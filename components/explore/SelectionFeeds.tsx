import { useEffect } from "react";
import useLoadSelectionFeeds from "~/hooks/explore/useLoadSelectionFeeds";
import ChannelListWithCasts from "./ChannelListWithCasts";

export default function SelectionFeeds() {
  const { loadItems, loading, items } = useLoadSelectionFeeds();
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <ChannelListWithCasts
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
