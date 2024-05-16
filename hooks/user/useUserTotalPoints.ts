import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";
import {
  fetchTotalPoints,
  selectUserAction,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
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

  const getTotalPoints = useCallback(async () => {
    if (totalPointsRequestStatus !== AsyncRequestStatus.IDLE) return;
    dispatch(fetchTotalPoints());
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
    fetchTotalPoints: getTotalPoints,
  };
}
