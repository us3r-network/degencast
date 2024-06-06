import { useCallback, useEffect, useMemo, useState } from "react";
import { FarCast } from "~/services/farcaster/types";
import useFarcasterWrite from "./useFarcasterWrite";
import getCastHex from "~/utils/farcaster/getCastHex";
import useFarcasterAccount from "./useFarcasterAccount";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addRecast,
  addRecastPending,
  removeRecast,
  removeRecastPending,
  selectCastReactions,
} from "~/features/cast/castReactionsSlice";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterSigner from "./useFarcasterSigner";

export default function useFarcasterRecastAction({
  cast,
  onRecastSuccess,
  onRemoveRecastSuccess,
}: {
  cast: FarCast;
  onRecastSuccess?: () => void;
  onRemoveRecastSuccess?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { reactions, recastPendingCastIds } =
    useAppSelector(selectCastReactions);

  const { authenticated, login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { recastCast, removeRecastCast } = useFarcasterWrite();

  const castHex = useMemo(() => getCastHex(cast), [cast]);
  const castFid = useMemo(() => cast.fid, [cast]);

  const recasted = useMemo(
    () => !!reactions?.[castHex]?.recasted,
    [reactions, castHex],
  );
  const recastPending = useMemo(
    () => recastPendingCastIds.includes(castHex),
    [recastPendingCastIds, castHex],
  );

  const [recastCount, setRecastCount] = useState<number>(
    Number(cast.recast_count || cast.recastsCount || 0),
  );

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
      setRecastCount((pre) => pre + 1);
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
      setRecastCount((pre) => pre - 1);
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
