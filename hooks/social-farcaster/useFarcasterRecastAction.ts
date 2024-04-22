import { useCallback, useEffect, useState } from "react";
import { FarCast } from "~/services/farcaster/types";
import useFarcasterWrite from "./useFarcasterWrite";
import getCastHex from "~/utils/farcaster/getCastHex";
import useFarcasterAccount from "./useFarcasterAccount";

export default function useFarcasterRecastAction({
  cast,
  onRecastSuccess,
  onRemoveRecastSuccess,
}: {
  cast: FarCast;
  onRecastSuccess?: () => void;
  onRemoveRecastSuccess?: () => void;
}) {
  const { recastCast } = useFarcasterWrite();
  const { currFid } = useFarcasterAccount();
  const castHex = getCastHex(cast);
  const castFid = cast.fid;

  const [recasts, setRecasts] = useState<string[]>(
    Array.from(new Set(cast.recasts)),
  );
  const [recastCount, setRecastCount] = useState<number>(
    Number(cast.recast_count || cast.recastsCount || 0),
  );
  useEffect(() => {
    setRecasts(Array.from(new Set(cast.recasts)));
    setRecastCount(Number(cast.recast_count || cast.recastsCount || 0));
  }, [cast]);

  const [recastPending, setRecastPending] = useState(false);

  const recast = useCallback(async () => {
    if (recastPending) {
      return;
    }
    try {
      setRecastPending(true);
      await recastCast(castHex, Number(castFid));
      const tmpSet = new Set(recasts);
      tmpSet.add(`${currFid}`);
      setRecasts(Array.from(tmpSet));
      setRecastCount(recastCount + 1);
      onRecastSuccess?.();
      console.log("recast created");
    } catch (error) {
      console.error(error);
    } finally {
      setRecastPending(false);
    }
  }, [
    castHex,
    castFid,
    recastCount,
    recasts,
    currFid,
    recastPending,
    onRecastSuccess,
  ]);

  const removeRecast = useCallback(async () => {
    if (recastPending) {
      return;
    }
    try {
      setRecastPending(true);
      // TODO remove recast
      await recastCast(castHex, Number(castFid));
      const tmpSet = new Set(recasts);
      tmpSet.delete(`${currFid}`);
      setRecasts(Array.from(tmpSet));
      setRecastCount(recastCount - 1);
      onRemoveRecastSuccess?.();
      console.log("recast removed");
    } catch (error) {
      console.error(error);
    } finally {
      setRecastPending(false);
    }
  }, [castHex, castFid, recastCount, recasts, currFid, onRemoveRecastSuccess]);
  const recasted = recasts.includes(`${currFid}`);
  return {
    recast,
    removeRecast,
    recasts,
    recastCount,
    recasted,
    recastPending,
  };
}
