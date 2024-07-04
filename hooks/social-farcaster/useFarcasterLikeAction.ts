import { useCallback, useMemo } from "react";
import {
  addLike,
  addLikePending,
  removeLike,
  removeLikePending,
  selectCastReactions,
} from "~/features/cast/castReactionsSlice";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { UserActionName } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  getCastFid,
  getCastHex
} from "~/utils/farcaster/cast-utils";
import useAuth from "../user/useAuth";
import useUserAction from "../user/useUserAction";
import useFarcasterAccount from "./useFarcasterAccount";
import useFarcasterSigner from "./useFarcasterSigner";
import useFarcasterWrite from "./useFarcasterWrite";

export default function useFarcasterLikeAction({
  cast,
  onLikeSuccess,
  onRemoveLikeSuccess,
}: {
  cast: FarCast | NeynarCast;
  onLikeSuccess?: () => void;
  onRemoveLikeSuccess?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { reactions, likePendingCastIds } = useAppSelector(selectCastReactions);

  const { authenticated, login } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { submitUserAction } = useUserAction();
  const { likeCast, removeLikeCast } = useFarcasterWrite();

  const castHex = useMemo(() => getCastHex(cast), [cast]);
  const castFid = useMemo(() => getCastFid(cast), [cast]);

  const liked = useMemo(
    () => !!reactions?.[castHex]?.liked,
    [reactions, castHex],
  );
  const likeCount = useMemo(
    () => reactions?.[castHex]?.likesCount || 0,
    [reactions, castHex],
  );
  const likePending = useMemo(
    () => likePendingCastIds.includes(castHex),
    [likePendingCastIds, castHex],
  );

  // const [likeCount, setLikeCount] = useState<number>(
  //   getCastReactionsCount(cast).likesCount,
  // );

  const likeCastAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    if (likePending) {
      return;
    }
    try {
      dispatch(addLikePending(castHex));
      const res = await likeCast(castHex, Number(castFid));
      console.log("likeCastAction", res);

      dispatch(addLike(castHex));
      await submitUserAction({
        action: UserActionName.Like,
        castHash: castHex,
      });
      // setLikeCount((pre) => pre + 1);
      onLikeSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeLikePending(castHex));
    }
  }, [
    authenticated,
    currFid,
    hasSigner,
    likePending,
    castHex,
    castFid,
    login,
    requestSigner,
    likeCast,
    submitUserAction,
    onLikeSuccess,
  ]);

  const removeLikeCastAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    if (likePending) {
      return;
    }
    try {
      dispatch(addLikePending(castHex));
      const res = await removeLikeCast(castHex, Number(castFid));
      console.log("removeLikeCastAction", res);
      dispatch(removeLike(castHex));
      await submitUserAction({
        action: UserActionName.UnLike,
        castHash: castHex,
      });

      // setLikeCount((pre) => pre - 1);
      onRemoveLikeSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeLikePending(castHex));
    }
  }, [
    authenticated,
    currFid,
    hasSigner,
    likePending,
    castHex,
    castFid,
    login,
    requestSigner,
    submitUserAction,
    removeLikeCast,
    onRemoveLikeSuccess,
  ]);

  const fetchLikeActionsPending = true;

  return {
    likeCast: likeCastAction,
    removeLikeCast: removeLikeCastAction,
    likeCount,
    liked,
    likePending,
    fetchLikeActionsPending,
  };
}
