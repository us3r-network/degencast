import { useCallback, useEffect, useRef, useState } from "react";
import {
  TrendingCastData,
  getNaynarFarcasterTrending,
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

export default function useLoadExploreCastsWithNaynar() {
  const { addManyToLikedActions } = useUserCastLikeActionsUtil();
  const { submitSeenCast } = useSeenCasts();
  const { submitUserAction } = useUserAction();
  const [casts, setCasts] = useState<Array<TrendingCastData>>([]);
  const [currentCastIndex, setCurrentCastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const pageInfoRef = useRef<{
    hasNextPage: boolean;
    cursor: string;
    requestFailed?: boolean;
  }>({
    hasNextPage: true,
    cursor: "",
    requestFailed: false,
  });

  const loadCasts = async (cursor: string, limit: number) => {
    const { hasNextPage, requestFailed } = pageInfoRef.current;

    if (hasNextPage === false || requestFailed) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getNaynarFarcasterTrending({
        cursor,
        limit,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo, likeActions } = data;
      const unlikeActions =
        likeActions?.filter(
          (action) => action.action === UserActionName.UnLike,
        ) || [];
      const likedActions =
        likeActions?.filter(
          (action) =>
            !unlikeActions.find(
              (unlikeAction) => unlikeAction.castHash === action.castHash,
            ),
        ) || [];
      addManyToLikedActions(likedActions);
      setCasts((pre) => [...pre, ...casts]);
      pageInfoRef.current = pageInfo;
      // console.log("pageInfo", pageInfo);

      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      }
    } catch (err) {
      console.error(err);
      pageInfoRef.current["requestFailed"] = true;
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
  };

  const loadFirstPageCasts = async () => {
    await loadCasts("", FIRST_PAGE_SIZE);
  };

  const loadNextPageCasts = async () => {
    const { cursor } = pageInfoRef.current;
    await loadCasts(cursor, NEXT_PAGE_SIZE);
  };

  // load first page casts
  useEffect(() => {
    (async () => {
      pageInfoRef.current = {
        hasNextPage: true,
        cursor: "",
      };
      setCasts([]);
      await loadFirstPageCasts();
    })();
  }, []);

  // load more casts
  useEffect(() => {
    if (firstLoading || loading) return;
    const castsLen = casts.length;
    // if (castsLen < FIRST_PAGE_SIZE) {
    //   return;
    // }
    const remainingLen = castsLen - (currentCastIndex + 1);
    if (remainingLen <= LOAD_MORE_CRITICAL_NUM) {
      loadNextPageCasts();
    }
  }, [currentCastIndex, casts, loading, firstLoading]);

  const watchedCastsRef = useRef<string[]>([]);
  useEffect(() => {
    // seen casts
    const cast = casts?.[currentCastIndex]?.data as FarCast;
    const castHex = cast ? getCastHex(cast) : "";
    if (
      currentCastIndex !== 0 &&
      castHex &&
      !watchedCastsRef.current.includes(castHex)
    ) {
      submitSeenCast(castHex);
      watchedCastsRef.current.push(castHex);
    }
  }, [currentCastIndex, casts, submitSeenCast]);

  // 停留1秒再上报用户行为加积分
  const submitedViewActionCastsRef = useRef<string[]>([]);
  const currentCastIndexRef = useRef(currentCastIndex);
  useEffect(() => {
    currentCastIndexRef.current = currentCastIndex;
    const cast = casts?.[currentCastIndex]?.data as FarCast;
    const castHex = cast ? getCastHex(cast) : "";
    const timer = setTimeout(() => {
      if (castHex && currentCastIndexRef.current === currentCastIndex) {
        submitUserAction({
          action: UserActionName.View,
          castHash: castHex,
        });
        submitedViewActionCastsRef.current.push(castHex);
      }
    }, 500);

    // 如果已经上报过了，就不再上报
    if (!castHex || submitedViewActionCastsRef.current.includes(castHex)) {
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentCastIndex, casts, submitUserAction]);

  return {
    loading,
    casts,
    farcasterUserDataObj,
    currentCastIndex,
    setCurrentCastIndex,
  };
}
