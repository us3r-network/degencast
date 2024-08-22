import { useCallback, useRef, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { fetchCastConversationWithHash } from "~/services/farcaster/neynar/farcaster";
import { useAppDispatch } from "~/store/hooks";
import useFarcasterAccount from "./useFarcasterAccount";
import { ConversationCast } from "~/services/farcaster/types/neynar";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

export default function useLoadNeynarCastComments(castHex: string) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [comments, setComments] = useState<ConversationCast[]>();
  const { currFid } = useFarcasterAccount();
  const loadCastComments = useCallback(async () => {
    if (!castHex) {
      setComments([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchCastConversationWithHash({
        hash: castHex,
        viewer_fid: Number(currFid),
        reply_depth: 1,
      });
      const { direct_replies, replies } = res?.conversation?.cast || {};
      if (direct_replies) {
        const reactions = getReactionsCountAndViewerContexts(direct_replies);
        dispatch(upsertManyToReactions(reactions));
        setComments(direct_replies);
        setTotalComments(replies?.count || 0);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [castHex, currFid]);
  return {
    loading,
    comments,
    totalComments,
    loadCastComments,
  };
}
