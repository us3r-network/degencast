import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChannelCastData,
  getFarcasterTrendingWithChannelId,
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

export default function useLoadChannelExploreCasts(params: {
  channelId: string;
  initCast?: ChannelCastData | undefined | null;
}) {
  const { channelId, initCast } = params || {};
  const { addManyToLikedActions } = useUserCastLikeActionsUtil();
  const { submitSeenCast } = useSeenCasts();
  const { submitUserAction } = useUserAction();
  const [casts, setCasts] = useState<Array<ChannelCastData>>([]);
  const [currentCastIndex, setCurrentCastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const channelIdRef = useRef(channelId);
  const pageInfoRef = useRef<{
    hasNextPage: boolean;
    endIndex: number;
    requestFailed?: boolean;
  }>({
    hasNextPage: true,
    endIndex: 0,
    requestFailed: false,
  });
  const initCastRef = useRef(initCast);

  const loadCasts = async (start: number, end: number) => {
    const { hasNextPage, requestFailed } = pageInfoRef.current;

    if (hasNextPage === false || requestFailed) {
      return;
    }
    setLoading(true);
    try {
      console.log("loadCasts", start, end);
      const resp = await getFarcasterTrendingWithChannelId({
        start,
        end,
        channelId: channelIdRef.current,
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

      const initCastData = initCastRef.current;
      const filteredCastHexs = initCastData
        ? [getCastHex(initCastData.data)]
        : [];
      const newCasts = casts.filter(
        (item) => !filteredCastHexs?.includes(getCastHex(item.data)),
      );

      setCasts((pre) => [...pre, ...newCasts]);
      pageInfoRef.current = pageInfo;

      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      }
    } catch (err) {
      console.error(err);
      pageInfoRef.current["requestFailed"] = true;
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

  // load first page casts
  useEffect(() => {
    (async () => {
      pageInfoRef.current = {
        hasNextPage: true,
        endIndex: 0,
      };
      const initCastData = initCastRef.current;
      if (channelId !== channelIdRef.current) {
        channelIdRef.current = channelId;
        setCasts([]);
      } else if (initCastData) {
        setCasts([initCastData]);
      }
      await loadFirstPageCasts();
    })();
  }, [channelId]);

  // load more casts
  useEffect(() => {
    if (loading) return;
    const castsLen = casts.length;
    if (castsLen < FIRST_PAGE_SIZE) {
      return;
    }
    const remainingLen = castsLen - (currentCastIndex + 1);
    if (remainingLen <= LOAD_MORE_CRITICAL_NUM) {
      loadNextPageCasts();
    }
  }, [currentCastIndex, casts, loading]);

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
