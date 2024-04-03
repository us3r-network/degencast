import { postSeenCasts } from "~/services/farcaster/api";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addOneToUnreportedViewCasts,
  removeReportedViewCasts,
  selectUserAction,
  setUnreportedViewCastsSubmitStatus,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useSeenCasts() {
  const dispatch = useAppDispatch();
  const { authenticated } = usePrivy();
  const { unreportedViewCastsSubmitStatus, unreportedViewCasts } =
    useAppSelector(selectUserAction);

  const submitSeenCast = async (castHex: string) => {
    if (authenticated) {
      await postSeenCasts([castHex]);
    } else {
      dispatch(addOneToUnreportedViewCasts(castHex));
    }
  };

  const submitUnreportedViewCasts = useCallback(async () => {
    if (unreportedViewCastsSubmitStatus !== AsyncRequestStatus.IDLE) return;
    if (unreportedViewCasts.length > 0) {
      try {
        dispatch(
          setUnreportedViewCastsSubmitStatus(AsyncRequestStatus.PENDING),
        );
        await postSeenCasts(unreportedViewCasts);
        dispatch(removeReportedViewCasts(unreportedViewCasts));
        dispatch(
          setUnreportedViewCastsSubmitStatus(AsyncRequestStatus.FULFILLED),
        );
      } catch (error) {
        console.error(`submitUnreportedViewCasts error:`, error);
        dispatch(
          setUnreportedViewCastsSubmitStatus(AsyncRequestStatus.REJECTED),
        );
      }
    }
  }, [unreportedViewCasts, unreportedViewCastsSubmitStatus]);

  return { submitSeenCast, submitUnreportedViewCasts };
}
