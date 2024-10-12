import { useEffect, useState } from "react";
import useLoadCastFeeds from "~/hooks/explore/useLoadCastFeeds";
import CastListWithChannel from "../social-farcaster/proposal/CastListWithChannel";
import ExploreHeader from "../social-farcaster/proposal/ExploreHeader";

export default function CastFeeds({
  jumpTo,
}: {
  jumpTo?: (key: string) => void;
}) {
  const { loadItems, loading, items } = useLoadCastFeeds();
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <CastListWithChannel
      renderHeaderComponent={() => {
        return <ExploreHeader jumpTo={jumpTo} />;
      }}
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
