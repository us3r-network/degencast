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

  return config?.unit || 0;
}
