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
import useUserCastLikeActionsUtil from "../user/useUserCastLikeActionsUtil";

const FIRST_PAGE_SIZE = 3;
const LOAD_MORE_CRITICAL_NUM = 10;
const NEXT_PAGE_SIZE = 10;
export const MAX_VISIBLE_ITEMS = 3;

export default function useLoadExploreCasts() {
  const { addManyToLikedActions } = useUserCastLikeActionsUtil();
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

  const loadCasts = async (start: number, end: number) => {
    const { hasNextPage } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterTrending({
        start,
        end,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo, likeActions } = data;
      const unlikeActions = likeActions.filter(
        (action) => action.action === UserActionName.UnLike,
      );
      const likedActions = likeActions.filter(
        (action) =>
          !unlikeActions.find(
            (unlikeAction) => unlikeAction.castHash === action.castHash,
          ),
      );
      addManyToLikedActions(likedActions);
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

  const loadFirstPageCasts = async () => {
    await loadCasts(0, FIRST_PAGE_SIZE - 1);
  };

  const loadNextPageCasts = async () => {
    const { endIndex } = pageInfoRef.current;
    await loadCasts(endIndex + 1, endIndex + NEXT_PAGE_SIZE);
  };

  const removeCast = useCallback(
    (idx: number) => {
      // move pointer
      const nextIdx = idx + 1;
      setCurrentCastIndex(nextIdx);

      // load more casts
      const remainingLen = casts.length - nextIdx;
      if (!loading && remainingLen <= LOAD_MORE_CRITICAL_NUM) {
        loadNextPageCasts();
      }

      // seen casts
      const cast = casts[idx].data as FarCast;
      const castHex = getCastHex(cast);
      submitSeenCast(castHex);
    },
    [casts, loading, submitSeenCast],
  );

  // 停留两秒再上报用户行为加积分
  const currentCastIndexRef = useRef(currentCastIndex);
  useEffect(() => {
    currentCastIndexRef.current = currentCastIndex;
    const timer = setTimeout(() => {
      if (currentCastIndexRef.current === currentCastIndex) {
        const cast = casts[currentCastIndex].data as FarCast;
        const castHex = getCastHex(cast);
        submitUserAction({
          action: UserActionName.View,
          castHash: castHex,
        });
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentCastIndex, casts, submitUserAction]);

  useEffect(() => {
    (async () => {
      await loadFirstPageCasts();
      await loadNextPageCasts();
    })();
  }, []);

  return {
    loading,
    casts,
    farcasterUserDataObj,
    removeCast,
    currentCastIndex,
  };
}
