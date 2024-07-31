import { CardWarper, PageContent } from "~/components/layout/content/Content";
import { CuratorsList } from "~/components/rank/Curators";
import { useCommunityCtx } from "./_layout";
import useLoadChannelCurators from "~/hooks/community/useLoadChannelCurators";
import { useEffect } from "react";

export default function CuratorsScreen() {
  const { community } = useCommunityCtx();

  const channelId = community?.channelId || "";
  const { loadItems, loading, items, pageInfo } = useLoadChannelCurators({
    channelId,
  });
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <CardWarper>
      <CuratorsList
        loading={loading}
        items={items}
        load={() => {
          if (loading || (!loading && items?.length === 0)) return;
          loadItems();
          return;
        }}
        hasMore={pageInfo.hasNextPage}
      />
    </CardWarper>
  );
}
