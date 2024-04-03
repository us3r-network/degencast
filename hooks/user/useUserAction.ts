import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import {
  addOneToUnreportedActions,
  plusPoint,
  removeReportedActions,
  selectUserAction,
  setActionPointConfig,
  setActionPointConfigRequestStatus,
  setUnreportedActionsSubmitStatus,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { getActionPointConfig, postUserActions } from "~/services/user/api";
import { UserActionData } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import getActionPoint from "~/utils/action/getActionPoint";

export default function useUserAction() {
  const dispatch = useAppDispatch();
  const { authenticated } = usePrivy();

  const {
    actionPointConfig,
    actionPointConfigRequestStatus,
    unreportedActions,
    unreportedActionsSubmitStatus,
  } = useAppSelector(selectUserAction);

  const fetchUserActionConfig = useCallback(async () => {
    if (actionPointConfigRequestStatus !== AsyncRequestStatus.IDLE) return;
    try {
      dispatch(setActionPointConfigRequestStatus(AsyncRequestStatus.PENDING));
      const res = await getActionPointConfig();
      const { data } = res.data;
      dispatch(setActionPointConfig(data));
      dispatch(setActionPointConfigRequestStatus(AsyncRequestStatus.FULFILLED));
    } catch (error) {
      console.error(`fetchUserActionConfig error:`, error);
      dispatch(setActionPointConfigRequestStatus(AsyncRequestStatus.REJECTED));
    }
  }, [actionPointConfig, actionPointConfigRequestStatus]);

  const submitUserAction = useCallback(
    async (actionData: UserActionData) => {
      if (authenticated) {
        await postUserActions([actionData]);
        const point = getActionPoint(actionData, actionPointConfig);
        dispatch(plusPoint(point));
      } else {
        dispatch(addOneToUnreportedActions(actionData));
      }
    },
    [authenticated, actionPointConfig],
  );

  const submitUnreportedActions = useCallback(async () => {
    if (unreportedActionsSubmitStatus !== AsyncRequestStatus.IDLE) return;
    if (unreportedActions.length > 0) {
      try {
        dispatch(setUnreportedActionsSubmitStatus(AsyncRequestStatus.PENDING));
        await postUserActions(unreportedActions);
        dispatch(removeReportedActions(unreportedActions));
        dispatch(
          setUnreportedActionsSubmitStatus(AsyncRequestStatus.FULFILLED),
        );
      } catch (error) {
        console.error(`submitUnreportedActions error:`, error);
        dispatch(setUnreportedActionsSubmitStatus(AsyncRequestStatus.REJECTED));
      }
    }
  }, [unreportedActions, unreportedActionsSubmitStatus]);

  return {
    actionPointConfigRequestStatus,
    actionPointConfig,
    unreportedActions,
    unreportedActionsSubmitStatus,
    fetchUserActionConfig,
    submitUserAction,
    submitUnreportedActions,
  };
}
