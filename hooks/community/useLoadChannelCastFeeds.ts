import { useRef, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getChannelCastFeeds } from "~/services/feeds/api/channel";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

const PAGE_SIZE = 10;
export type CastFeedsItem = {
  cast: NeynarCast;
  proposal: ProposalEntity;
};

export default function useLoadChannelCastFeeds(props: { channelId: string }) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<CastFeedsItem[]>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const channelIdRef = useRef(props?.channelId || "");
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextCursor: "",
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const channelId = channelIdRef.current;
    const { hasNextPage, nextCursor, nextPageNumber } = pageInfoRef.current;

    if (!channelId || hasNextPage === false) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        limit: PAGE_SIZE,
        cursor: nextCursor,
        pageNumber: nextPageNumber,
        channelId,
      };
      const resp = await getChannelCastFeeds(params);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, next } = data;
      // console.log("casts", casts);

      setItems([...items, ...casts]);
      const reactions = getReactionsCountAndViewerContexts(
        casts.map((i) => i.cast),
      );
      dispatch(upsertManyToReactions(reactions));

      pageInfoRef.current = {
        hasNextPage:
          !!next.cursor &&
          (casts.length >= PAGE_SIZE ||
            (casts.length > 0 && next.cursor !== nextCursor)),
        nextCursor: next.cursor,
        nextPageNumber: nextPageNumber + 1,
      };
      setStatus(AsyncRequestStatus.FULFILLED);
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
