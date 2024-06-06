import { useCallback, useEffect, useMemo, useState } from "react";
import { FarCast } from "~/services/farcaster/types";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterWrite from "./useFarcasterWrite";
import getCastHex from "~/utils/farcaster/getCastHex";
import useFarcasterAccount from "./useFarcasterAccount";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";
import useUserCastLikeActionsUtil from "../user/useUserCastLikeActionsUtil";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addLikePending,
  removeLikePending,
  selectCastReactions,
} from "~/features/cast/castReactionsSlice";

export default function useFarcasterLikeAction({
  cast,
  onLikeSuccess,
  onRemoveLikeSuccess,
}: {
  cast: FarCast;
  onLikeSuccess?: () => void;
  onRemoveLikeSuccess?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { reactions, likePendingCastIds } = useAppSelector(selectCastReactions);
  const { user, authenticated } = usePrivy();
  const { signerPublicKey } = useFarcasterAccount();

  const { submitUserAction } = useUserAction();
  const { likeCast: likeCastAction } = useFarcasterWrite();

  const castHex = useMemo(() => getCastHex(cast), [cast]);
  const liked = useMemo(
    () => !!reactions?.[castHex]?.liked,
    [reactions, castHex],
  );
  const likePending = useMemo(
    () => likePendingCastIds.includes(castHex),
    [likePendingCastIds, castHex],
  );
  const castFid = useMemo(() => cast.fid, [cast]);
  const currFid = user?.farcaster?.fid;

  const [likes, setLikes] = useState<string[]>(Array.from(new Set(cast.likes)));
  const [likeCount, setLikeCount] = useState<number>(
    Number(cast.like_count || cast.likesCount || 0),
  );

  useEffect(() => {
    setLikes(Array.from(new Set(cast.likes)));
    setLikeCount(Number(cast.like_count || cast.likesCount || 0));
  }, [cast]);

  const likeCast = useCallback(async () => {
    if (likePending) {
      return;
    }
    try {
      dispatch(addLikePending(castHex));
      await submitUserAction({
        action: UserActionName.Like,
        castHash: castHex,
      });
      if (signerPublicKey) {
        await likeCastAction(castHex, Number(castFid));
      }

      const tmpSet = new Set(likes);
      tmpSet.add(`${currFid}`);
      setLikes(Array.from(tmpSet));
      setLikeCount(likeCount + 1);
      onLikeSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeLikePending(castHex));
    }
  }, [
    castHex,
    castFid,
    likeCount,
    likes,
    currFid,
    likePending,
    signerPublicKey,
    submitUserAction,
    likeCastAction,
    onLikeSuccess,
  ]);

  const removeLikeCast = useCallback(async () => {
    if (likePending) {
      return;
    }
    try {
      dispatch(addLikePending(castHex));
      await submitUserAction({
        action: UserActionName.UnLike,
        castHash: castHex,
      });
      if (signerPublicKey) {
        await likeCastAction(castHex, Number(castFid));
      }

      const tmpSet = new Set(likes);
      tmpSet.delete(`${currFid}`);
      setLikes(Array.from(tmpSet));
      setLikeCount(likeCount - 1);
      onRemoveLikeSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeLikePending(castHex));
    }
  }, [
    castHex,
    castFid,
    likeCount,
    likes,
    currFid,
    likePending,
    submitUserAction,
    likeCastAction,
    onRemoveLikeSuccess,
  ]);

  const fetchLikeActionsPending = true;

  return {
    likes,
    likeCount,
    likeCast,
    removeLikeCast,
    liked,
    likePending,
    fetchLikeActionsPending,
  };
}
