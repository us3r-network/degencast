import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import {
  addOneToUnreportedActions,
  plusTotalPoints,
  removeReportedActions,
  selectUserAction,
  setActionPointConfig,
  setActionPointConfigRequestStatus,
  setUnreportedActionsSubmitStatus,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { getActionPointConfig, postUserActions } from "~/services/user/api";
import { UserActionData, UserActionName } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import getActionPoint from "~/utils/action/getActionPoint";
import useUserCastLikeActionsUtil from "./useUserCastLikeActionsUtil";

export default function useUserAction() {
  const dispatch = useAppDispatch();
  const { authenticated } = usePrivy();

  const {
    actionPointConfig,
    actionPointConfigRequestStatus,
    unreportedActions,
    unreportedActionsSubmitStatus,
  } = useAppSelector(selectUserAction);

  const { addManyToLikedActions, removeOneLidedActions } =
    useUserCastLikeActionsUtil();

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
        dispatch(plusTotalPoints(point));
      } else {
        dispatch(addOneToUnreportedActions(actionData));
      }
      if (actionData.action === UserActionName.Like) {
        addManyToLikedActions([actionData]);
      }
      if (actionData.action === UserActionName.UnLike) {
        removeOneLidedActions(actionData.castHash);
      }
    },
    [
      authenticated,
      actionPointConfig,
      addManyToLikedActions,
      removeOneLidedActions,
    ],
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
