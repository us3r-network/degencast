import { useEffect, useRef, useState } from "react";
import { getNaynarChannelCastsFeed } from "~/services/farcaster/api";
import useSeenCasts from "../user/useSeenCasts";
import { FarCast } from "~/services/farcaster/types";
import { UserActionName } from "~/services/user/types";
import useUserAction from "../user/useUserAction";
import { useAppDispatch } from "~/store/hooks";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

const FIRST_PAGE_SIZE = 3;
const LOAD_MORE_CRITICAL_NUM = 10;
const NEXT_PAGE_SIZE = 10;

export default function useLoadChannelExploreCastsWithNeynar(params: {
  channelId: string;
  initCast?: NeynarCast | FarCast | undefined | null;
  swipeDataRefValue: any;
  onViewCastActionSubmited?: () => void;
}) {
  const { channelId, initCast, swipeDataRefValue, onViewCastActionSubmited } =
    params || {};
  const dispatch = useAppDispatch();
  const { submitSeenCast } = useSeenCasts();
  const { submitUserAction } = useUserAction();
  const [casts, setCasts] = useState<Array<NeynarCast | FarCast>>([]);
  const [currentCastIndex, setCurrentCastIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const channelIdRef = useRef(channelId);
  const pageInfoRef = useRef<{
    hasNextPage: boolean;
    cursor: string;
    requestFailed?: boolean;
  }>({
    hasNextPage: true,
    cursor: "",
    requestFailed: false,
  });
  const initCastRef = useRef(initCast);

  const loadCasts = async (cursor: string, limit: number) => {
    const { hasNextPage, requestFailed } = pageInfoRef.current;

    if (hasNextPage === false || requestFailed) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getNaynarChannelCastsFeed({
        cursor,
        limit,
        channelId: channelIdRef.current,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, pageInfo } = data;

      const initCastData = initCastRef.current;
      let filteredCastHexs: string[] = [];
      if (initCastData) {
        filteredCastHexs = [getCastHex(initCastData)];
      }
      const newCasts = casts.filter(
        (item) => !filteredCastHexs?.includes(getCastHex(item)),
      );
      const reactions = getReactionsCountAndViewerContexts(newCasts);
      dispatch(upsertManyToReactions(reactions));

      setCasts((pre) => [...pre, ...newCasts]);
      pageInfoRef.current = pageInfo;
    } catch (err) {
      console.error(err);
      pageInfoRef.current["requestFailed"] = true;
    } finally {
      setLoading(false);
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
      const initCastData = initCastRef.current;
      if (channelId !== channelIdRef.current) {
        channelIdRef.current = channelId;
        setCasts([]);
      } else if (initCastData) {
        setCasts([initCastData as any]);
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
    const cast = casts?.[currentCastIndex];
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
    const cast = casts?.[currentCastIndex];
    const castHex = cast ? getCastHex(cast) : "";
    const timer = setTimeout(() => {
      if (
        currentCastIndexRef.current !== 0 &&
        castHex &&
        currentCastIndexRef.current === currentCastIndex
      ) {
        submitUserAction({
          action: UserActionName.View,
          castHash: castHex,
          data: {
            swipeData: swipeDataRefValue,
          },
        });
        submitedViewActionCastsRef.current.push(castHex);
        onViewCastActionSubmited && onViewCastActionSubmited();
      }
    }, 500);

    // 如果已经上报过了，就不再上报
    if (!castHex || submitedViewActionCastsRef.current.includes(castHex)) {
      clearTimeout(timer);
      onViewCastActionSubmited && onViewCastActionSubmited();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentCastIndex, casts, submitUserAction]);

  return {
    loading,
    casts,
    currentCastIndex,
    setCurrentCastIndex,
  };
}
