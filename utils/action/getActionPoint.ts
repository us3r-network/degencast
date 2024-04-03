import {
  UserActionData,
  UserActionName,
  UserActionPointConfig,
} from "~/services/user/types";

export default function getActionPoint(
  actionData: UserActionData,
  actionPointConfig: UserActionPointConfig,
) {
  const actionName = actionData.action;
  const config = actionPointConfig[actionName];
  if (
    [
      UserActionName.View,
      UserActionName.Like,
      UserActionName.UnLike,
      UserActionName.Share,
    ].includes(actionName)
  ) {
    return config?.unit || 0;
  }
  if ([UserActionName.Tips].includes(actionName)) {
    return actionData.data?.value || 0;
  }
  // TODO other actions
  return 0;
}
