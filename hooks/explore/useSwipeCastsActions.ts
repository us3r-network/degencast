import { useEffect, useRef } from "react";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import useSeenCasts from "../user/useSeenCasts";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export default function useSwipeCastsActions(opts: {
  casts: Array<FarCast | NeynarCast | null | undefined>;
  currentCastIndex: number;
  swipeDataRefValue: any;
  onViewCastActionSubmited?: () => void;
}) {
  const { submitSeenCast, reportedViewCasts, unreportedViewCasts } =
    useSeenCasts();
  const { submitUserAction, reportedActions, unreportedActions } =
    useUserAction();
  const {
    casts,
    currentCastIndex,
    swipeDataRefValue,
    onViewCastActionSubmited,
  } = opts || {};
  const watchedCastsRef = useRef<string[]>([]);
  useEffect(() => {
    const viewedCasts = Array.from(
      new Set([
        ...reportedViewCasts,
        ...unreportedViewCasts,
        ...watchedCastsRef.current,
      ]),
    );
    watchedCastsRef.current = viewedCasts;
  }, [reportedViewCasts, unreportedViewCasts]);
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
    const reportedViewCasts = reportedActions
      .filter((item) => item.action === UserActionName.View && item.castHash)
      .map((item) => item.castHash) as string[];
    const unreportedViewCasts = unreportedActions
      .filter((item) => item.action === UserActionName.View && item.castHash)
      .map((item) => item.castHash) as string[];
    const viewedCasts = Array.from(
      new Set([
        ...reportedViewCasts,
        ...unreportedViewCasts,
        ...submitedViewActionCastsRef.current,
      ]),
    );
    submitedViewActionCastsRef.current = viewedCasts;
  }, [reportedActions, unreportedActions]);

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
}
