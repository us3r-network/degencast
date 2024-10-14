import { useRef, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { getCastReplies } from "~/services/farcaster/api";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

const PAGE_SIZE = 10;
export type CastReplyItem = {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  cast: NeynarCast;
  proposal: ProposalEntity;
};

export default function useCastReplies(props?: {
  type?: string;
  castHash: string;
}) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<CastReplyItem[]>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const typeRef = useRef(props?.type || "");
  const castHashRef = useRef(props?.castHash || "");
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextCursor: "",
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const type = typeRef.current;
    const castHash = castHashRef.current;
    const { hasNextPage, nextCursor, nextPageNumber } = pageInfoRef.current;

    if (!castHash) {
      return;
    }
    if (hasNextPage === false) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        limit: PAGE_SIZE,
        cursor: nextCursor,
        pageNumber: nextPageNumber,
        ...(type && { type }),
      };
      const resp = await getCastReplies(castHash, params);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, next } = data;
      // console.log("casts", casts);

      setItems([...items, ...casts]);

      pageInfoRef.current = {
        hasNextPage:
          !!next?.cursor &&
          (casts.length >= PAGE_SIZE ||
            (casts.length > 0 && next?.cursor !== nextCursor)),
        nextCursor: next?.cursor || "",
        nextPageNumber: nextPageNumber + 1,
      };
      console.log("pageInfoRef.current", pageInfoRef.current);

      setStatus(AsyncRequestStatus.FULFILLED);

      const reactions = getReactionsCountAndViewerContexts(
        casts.map((i) => i.cast),
      );
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
