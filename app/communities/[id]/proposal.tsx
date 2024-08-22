import { useEffect } from "react";
import ProposalCastList from "~/components/social-farcaster/proposal/ProposalCastList";
import { useCommunityCtx } from "./_layout";
import useLoadChannelProposalFeeds from "~/hooks/community/useLoadChannelProposalFeeds";

export default function ProposalFeeds() {
  const { community, tokenInfo } = useCommunityCtx();

  const channelId = community?.channelId || "";
  const { loadItems, loading, items } = useLoadChannelProposalFeeds({
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
