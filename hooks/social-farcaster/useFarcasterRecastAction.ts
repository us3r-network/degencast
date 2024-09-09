import { useCallback, useMemo } from "react";
import {
  addRecast,
  addRecastPending,
  removeRecast,
  removeRecastPending,
  selectCastReactions,
} from "~/features/cast/castReactionsSlice";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  getCastFid,
  getCastHex
} from "~/utils/farcaster/cast-utils";
import useAuth from "../user/useAuth";
import useFarcasterAccount from "./useFarcasterAccount";
import useFarcasterSigner from "./useFarcasterSigner";
import useFarcasterWrite from "./useFarcasterWrite";

export default function useFarcasterRecastAction({
  cast,
  onRecastSuccess,
  onRemoveRecastSuccess,
}: {
  cast: FarCast | NeynarCast;
  onRecastSuccess?: () => void;
  onRemoveRecastSuccess?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { reactions, recastPendingCastIds } =
    useAppSelector(selectCastReactions);

  const { authenticated, login } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { recastCast, removeRecastCast } = useFarcasterWrite();

  const castHex = useMemo(() => getCastHex(cast), [cast]);
  const castFid = useMemo(() => getCastFid(cast), [cast]);

  const recasted = useMemo(
    () => !!reactions?.[castHex]?.recasted,
    [reactions, castHex],
  );
  const recastCount = useMemo(
    () => reactions?.[castHex]?.recastsCount || 0,
    [reactions, castHex],
  );
  const recastPending = useMemo(
    () => recastPendingCastIds.includes(castHex),
    [recastPendingCastIds, castHex],
  );

  // const [recastCount, setRecastCount] = useState<number>(
  //   getCastReactionsCount(cast).recastsCount,
  // );

  const recastCastAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    if (recastPending) {
      return;
    }
    try {
      dispatch(addRecastPending(castHex));
      const res = await recastCast(castHex, Number(castFid));
      console.log("recastCastAction", res);
      dispatch(addRecast(castHex));
      // setRecastCount((pre) => pre + 1);
      onRecastSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeRecastPending(castHex));
    }
  }, [
    authenticated,
    currFid,
    hasSigner,
    recastPending,
    castHex,
    castFid,
    login,
    requestSigner,
    recastCast,
    onRecastSuccess,
  ]);

  const removeRecastAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    if (recastPending) {
      return;
    }
    try {
      dispatch(addRecastPending(castHex));
      const res = await removeRecastCast(castHex, Number(castFid));
      console.log("removeRecastAction", res);
      dispatch(removeRecast(castHex));
      // setRecastCount((pre) => pre - 1);
      onRemoveRecastSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeRecastPending(castHex));
    }
  }, [
    authenticated,
    currFid,
    hasSigner,
    recastPending,
    castHex,
    castFid,
    login,
    requestSigner,
    removeRecastCast,
    onRemoveRecastSuccess,
  ]);

  return {
    recast: recastCastAction,
    removeRecast: removeRecastAction,
    recastCount,
    recasted,
    recastPending,
  };
}
