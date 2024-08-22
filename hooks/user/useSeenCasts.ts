import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addOneToUnreportedViewCasts,
  selectUserAction,
  submitSeenCast,
  submitUnreportedViewCasts,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import useAuth from "./useAuth";

export default function useSeenCasts() {
  const dispatch = useAppDispatch();
  const { login, ready, authenticated } = useAuth();
  const {
    unreportedViewCastsSubmitStatus,
    unreportedViewCasts,
    reportedViewCasts,
  } = useAppSelector(selectUserAction);

  const postSeenCast = async (castHex: string) => {
    if (authenticated) {
      dispatch(submitSeenCast(castHex));
    } else {
      dispatch(addOneToUnreportedViewCasts(castHex));
    }
  };

  const postUnreportedViewCasts = useCallback(async () => {
    if (unreportedViewCastsSubmitStatus !== AsyncRequestStatus.IDLE) return;
    dispatch(submitUnreportedViewCasts());
  }, [unreportedViewCasts, unreportedViewCastsSubmitStatus]);

  return {
    submitSeenCast: postSeenCast,
    submitUnreportedViewCasts: postUnreportedViewCasts,
    reportedViewCasts,
    unreportedViewCasts,
  };
}
