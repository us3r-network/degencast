import { useCallback, useEffect, useState } from "react";
import { FarCast } from "~/services/farcaster/types";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterWrite from "./useFarcasterWrite";
import getCastHex from "~/utils/farcaster/getCastHex";
import useFarcasterAccount from "./useFarcasterAccount";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";
import useUserCastLikeActionsUtil from "../user/useUserCastLikeActionsUtil";

export default function useFarcasterLikeAction({
  cast,
  onLikeSuccess,
  onRemoveLikeSuccess,
}: {
  cast: FarCast;
  onLikeSuccess?: () => void;
  onRemoveLikeSuccess?: () => void;
}) {
  const { user, authenticated } = usePrivy();
  const { signerPublicKey } = useFarcasterAccount();

  const { submitUserAction } = useUserAction();
  const { likeCast: likeCastAction } = useFarcasterWrite();

  const castHex = getCastHex(cast);
  const castFid = cast.fid;
  const currFid = user?.farcaster?.fid;

  const { validateLiked, validateLikeActionsPending, fetchCastLikeActions } =
    useUserCastLikeActionsUtil();

  const [likes, setLikes] = useState<string[]>(Array.from(new Set(cast.likes)));
  const [likeCount, setLikeCount] = useState<number>(
    Number(cast.like_count || cast.likesCount || 0),
  );
  const [likePending, setLikePending] = useState(false);

  useEffect(() => {
    setLikes(Array.from(new Set(cast.likes)));
    setLikeCount(Number(cast.like_count || cast.likesCount || 0));
  }, [cast]);

  useEffect(() => {
    if (authenticated && castHex) {
      fetchCastLikeActions(castHex);
    }
  }, [authenticated, castHex, fetchCastLikeActions]);

  const likeCast = useCallback(async () => {
    if (likePending) {
      return;
    }
    try {
      setLikePending(true);
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
      setLikePending(false);
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
      setLikePending(true);
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
      setLikePending(false);
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

  // const liked = likes.includes(`${currFid}`);
  const liked = validateLiked(castHex);
  const fetchLikeActionsPending = validateLikeActionsPending(castHex);

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
