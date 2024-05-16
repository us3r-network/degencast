import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addOneToUnreportedViewCasts,
  selectUserAction,
  submitSeenCast,
  submitUnreportedViewCasts,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useSeenCasts() {
  const dispatch = useAppDispatch();
  const { authenticated } = usePrivy();
  const { unreportedViewCastsSubmitStatus, unreportedViewCasts } =
    useAppSelector(selectUserAction);

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
  };
}
