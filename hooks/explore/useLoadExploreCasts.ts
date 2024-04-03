import { useCallback, useEffect, useRef, useState } from "react";
import {
  TrendingCastData,
  getFarcasterTrending,
} from "~/services/farcaster/api";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
import useSeenCasts from "../user/useSeenCasts";
import { FarCast } from "~/services/farcaster/types";
import getCastHex from "~/utils/farcaster/getCastHex";
import { UserActionName } from "~/services/user/types";
import useUserAction from "../user/useUserAction";

const FIRST_PAGE_SIZE = 20;
const LOAD_MORE_CRITICAL_NUM = 10;
const NEXT_PAGE_SIZE = 10;

export default function useLoadExploreCasts() {
  const { submitSeenCast } = useSeenCasts();
  const { submitUserAction } = useUserAction();
  const [casts, setCasts] = useState<Array<TrendingCastData>>([]);
  const [currentCastIndex, setCurrentCastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const pageInfoRef = useRef({
    hasNextPage: true,
    endIndex: 0,
  });

  const loadCasts = async () => {
    const { hasNextPage, endIndex } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterTrending({
        start: endIndex === 0 ? 0 : endIndex + 1,
        end: endIndex === 0 ? FIRST_PAGE_SIZE - 1 : endIndex + NEXT_PAGE_SIZE,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo } = data;
      setCasts((pre) => [...pre, ...casts]);
      pageInfoRef.current = pageInfo;

      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeCast = useCallback(
    (idx: number) => {
      const nextIdx = idx + 1;
      setCurrentCastIndex(nextIdx);
      const remainingLen = casts.length - nextIdx;
      if (!loading && remainingLen <= LOAD_MORE_CRITICAL_NUM) {
        loadCasts();
      }
      const cast = casts[idx].data as FarCast;
      // seen casts
      const castHex = getCastHex(cast);
      submitSeenCast(castHex);
      submitUserAction({
        action: UserActionName.View,
        castHash: castHex,
      });
    },
    [casts, loading, submitSeenCast, submitUserAction],
  );

  useEffect(() => {
    loadCasts();
  }, []);

  return {
    loading,
    casts,
    farcasterUserDataObj,
    removeCast,
    currentCastIndex,
  };
}
