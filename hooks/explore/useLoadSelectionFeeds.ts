import { useRef, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getExploreSelectionFeeds } from "~/services/feeds/api";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

const PAGE_SIZE = 20;
export type SelectionFeedsItem = {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  casts: Array<{
    cast: NeynarCast;
    proposal: ProposalEntity;
  }>;
};
export default function useLoadSelectionFeeds(props?: { type?: string }) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<SelectionFeedsItem[]>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const typeRef = useRef(props?.type || "");
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const type = typeRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        ...(type && { type }),
      };
      const resp = await getExploreSelectionFeeds(params);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;

      setItems((prev) => [...prev, ...data]);

      pageInfoRef.current = {
        hasNextPage: data.length >= PAGE_SIZE,
        nextPageNumber: nextPageNumber + 1,
      };
      setStatus(AsyncRequestStatus.FULFILLED);

      const casts = data.map((item) => item.casts.map((i) => i.cast)).flat();
      const reactions = getReactionsCountAndViewerContexts(casts);
      dispatch(upsertManyToReactions(reactions));
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    }
  };

  return {
    loading,
    items,
    loadItems,
  };
}
