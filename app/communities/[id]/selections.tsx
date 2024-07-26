import { useEffect } from "react";
import ProposalCastList from "~/components/social-farcaster/proposal/ProposalCastList";
import { useCommunityCtx } from "./_layout";
import useLoadChannelSelectionFeeds from "~/hooks/community/useLoadChannelSelectionFeeds";

export default function SelectionFeeds() {
  const { community, tokenInfo } = useCommunityCtx();

  const channelId = community?.channelId || "";
  const { loadItems, loading, items } = useLoadChannelSelectionFeeds({
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
