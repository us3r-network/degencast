import { useEffect } from "react";
import useLoadCastFeeds from "~/hooks/explore/useLoadCastFeeds";
import CastListWithChannel from "../social-farcaster/proposal/CastListWithChannel";

export default function CastFeeds() {
  const { loadItems, loading, items } = useLoadCastFeeds();
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <CastListWithChannel
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
