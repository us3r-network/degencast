import { useCallback } from "react";
import {
  addOneToUnreportedActions,
  fetchUserActionConfig,
  selectUserAction,
  submitAction,
  submitUnreportedActions,
} from "~/features/user/userActionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { UserActionData, UserActionName } from "~/services/user/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import useUserCastLikeActionsUtil from "./useUserCastLikeActionsUtil";
import useAuth from "./useAuth";

export default function useUserAction() {
  const dispatch = useAppDispatch();
  const { authenticated } = useAuth();

  const {
    actionPointConfig,
    actionPointConfigRequestStatus,
    reportedActions,
    unreportedActions,
    unreportedActionsSubmitStatus,
  } = useAppSelector(selectUserAction);

  const { addManyToLikedActions, removeOneLidedActions } =
    useUserCastLikeActionsUtil();

  const getUserActionConfig = useCallback(async () => {
    if (actionPointConfigRequestStatus !== AsyncRequestStatus.IDLE) return;
    dispatch(fetchUserActionConfig());
  }, [actionPointConfigRequestStatus]);

  const submitUserAction = useCallback(
    async (actionData: UserActionData) => {
      if (authenticated) {
        dispatch(submitAction(actionData));
      } else {
        dispatch(addOneToUnreportedActions(actionData));
      }
      if (actionData.action === UserActionName.Like) {
        addManyToLikedActions([actionData]);
      }
      if (actionData.action === UserActionName.UnLike) {
        removeOneLidedActions(actionData.castHash!);
      }
    },
    [
      authenticated,
      actionPointConfig,
      addManyToLikedActions,
      removeOneLidedActions,
    ],
  );

  const submitLocalUnreportedActions = useCallback(async () => {
    if (unreportedActionsSubmitStatus !== AsyncRequestStatus.IDLE) return;
    dispatch(submitUnreportedActions());
  }, [unreportedActionsSubmitStatus]);

  return {
    actionPointConfigRequestStatus,
    actionPointConfig,
    reportedActions,
    unreportedActions,
    unreportedActionsSubmitStatus,
    fetchUserActionConfig: getUserActionConfig,
    submitUserAction,
    submitUnreportedActions: submitLocalUnreportedActions,
  };
}
