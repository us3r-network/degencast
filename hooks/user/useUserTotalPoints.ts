import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";
import {
  selectUserAction,
  setTotalPoints,
  setTotalPointsRequestStatus,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { getUserPoints } from "~/services/user/api";
import { UserActionName } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import getActionPoint from "~/utils/action/getActionPoint";

export default function useUserTotalPoints() {
  const dispatch = useAppDispatch();
  const { authenticated } = usePrivy();

  const {
    actionPointConfig,
    unreportedActions,
    totalPoints: reportedTotalPoints,
    totalPointsRequestStatus,
  } = useAppSelector(selectUserAction);

  const fetchTotalPoints = useCallback(async () => {
    if (totalPointsRequestStatus !== AsyncRequestStatus.IDLE) return;
    try {
      dispatch(setTotalPointsRequestStatus(AsyncRequestStatus.PENDING));
      const res = await getUserPoints();
      const { data } = res.data;
      dispatch(setTotalPoints(data?.value || 0));
      dispatch(setTotalPointsRequestStatus(AsyncRequestStatus.FULFILLED));
    } catch (error) {
      console.error(`fetchTotalPoints error:`, error);
      dispatch(setTotalPointsRequestStatus(AsyncRequestStatus.REJECTED));
    }
  }, [totalPointsRequestStatus]);

  const totalPoints = useMemo(() => {
    if (authenticated) {
      return reportedTotalPoints;
    }
    if (!actionPointConfig || unreportedActions.length === 0) {
      return 0;
    }
    let points = 0;
    for (const action of unreportedActions) {
      const point = getActionPoint(action, actionPointConfig);
      points += point;
    }
    return points;
  }, [
    authenticated,
    reportedTotalPoints,
    unreportedActions,
    actionPointConfig,
  ]);

  return {
    totalPointsRequestStatus,
    totalPoints,
    fetchTotalPoints,
  };
}
