import { useEffect } from "react";
import ProposalCastList from "~/components/social-farcaster/proposal/ProposalCastList";
import useLoadChannelCastFeeds from "~/hooks/community/useLoadChannelCastFeeds";
import { useCommunityCtx } from "./_layout";

export default function CastFeeds() {
  const { community, tokenInfo } = useCommunityCtx();

  const channelId = community?.channelId || "";
  const { loadItems, loading, items } = useLoadChannelCastFeeds({
    channelId,
  });

  useEffect(() => {
    loadItems();
  }, []);
  return (
    <ProposalCastList
      channel={community as any}
      tokenInfo={tokenInfo as any}
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
