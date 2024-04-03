import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { UserActionData, UserActionPointConfig } from "~/services/user/types";
import { AsyncRequestStatus } from "~/services/shared/types";

export const keyPrefix = "degencast";
export const unreportedActionsKey = `${keyPrefix}:unreportedActions`;
export const unreportedViewCastsKey = `${keyPrefix}:unreportedViewCasts`;

export const getStoredUnreportedActions = () => {
  try {
    const unreportedActions = localStorage.getItem(unreportedActionsKey);
    return unreportedActions ? JSON.parse(unreportedActions) : [];
  } catch (error) {
    return [];
  }
};

export const storeUnreportedActions = (unreportedActions: any[]) => {
  localStorage.setItem(unreportedActionsKey, JSON.stringify(unreportedActions));
};

export const getStoredUnreportedViewCasts = () => {
  try {
    const unreportedViewCasts = localStorage.getItem(unreportedViewCastsKey);
    return unreportedViewCasts ? JSON.parse(unreportedViewCasts) : [];
  } catch (error) {
    return [];
  }
};

export const storeUnreportedViewCasts = (unreportedViewCasts: any[]) => {
  localStorage.setItem(
    unreportedViewCastsKey,
    JSON.stringify(unreportedViewCasts),
  );
};

type UserActionState = {
  actionPointConfig: UserActionPointConfig;
  actionPointConfigRequestStatus: AsyncRequestStatus;
  totalPoints: number;
  totalPointsRequestStatus: AsyncRequestStatus;
  unreportedActions: Array<UserActionData>;
  unreportedActionsSubmitStatus: AsyncRequestStatus;
  unreportedViewCasts: Array<string>;
  unreportedViewCastsSubmitStatus: AsyncRequestStatus;
};

const defaultActionPointConfig: UserActionPointConfig = {
  Share: { unit: 500 },
  View: { unit: 1, dailyLimit: 30 },
  Like: { unit: 1, dailyLimit: 30 },
  Tips: { unit: 1 },
  ConnectFarcaster: { unit: 500 },
  BuyChannelShare: { unit: 500 },
};
const userActionState: UserActionState = {
  actionPointConfig: defaultActionPointConfig,
  actionPointConfigRequestStatus: AsyncRequestStatus.IDLE,
  totalPoints: 0,
  totalPointsRequestStatus: AsyncRequestStatus.IDLE,
  unreportedActions: getStoredUnreportedActions(),
  unreportedActionsSubmitStatus: AsyncRequestStatus.IDLE,
  unreportedViewCasts: getStoredUnreportedViewCasts(),
  unreportedViewCastsSubmitStatus: AsyncRequestStatus.IDLE,
};

export const userActionSlice = createSlice({
  name: "userAction",
  initialState: userActionState,
  reducers: {
    setActionPointConfig: (
      state: UserActionState,
      action: PayloadAction<UserActionPointConfig>,
    ) => {
      state.actionPointConfig = action.payload;
    },
    setActionPointConfigRequestStatus: (
      state: UserActionState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.actionPointConfigRequestStatus = action.payload;
    },
    setTotalPoints: (state: UserActionState, action: PayloadAction<number>) => {
      state.totalPoints = action.payload;
    },
    setTotalPointsRequestStatus: (
      state: UserActionState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.totalPointsRequestStatus = action.payload;
    },
    plusPoint: (state: UserActionState, action: PayloadAction<number>) => {
      state.totalPoints += action.payload;
    },
    addOneToUnreportedActions: (
      state: UserActionState,
      action: PayloadAction<UserActionData>,
    ) => {
      state.unreportedActions.push(action.payload);
      storeUnreportedActions(state.unreportedActions);
    },
    removeReportedActions: (
      state: UserActionState,
      action: PayloadAction<Array<UserActionData>>,
    ) => {
      const reportedActionsLength = action.payload.length;
      state.unreportedActions = state.unreportedActions.slice(
        reportedActionsLength,
      );
      storeUnreportedActions(state.unreportedActions);
    },
    setUnreportedActionsSubmitStatus: (
      state: UserActionState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.unreportedActionsSubmitStatus = action.payload;
    },
    addOneToUnreportedViewCasts: (
      state: UserActionState,
      action: PayloadAction<string>,
    ) => {
      state.unreportedViewCasts.push(action.payload);
      storeUnreportedViewCasts(state.unreportedViewCasts);
    },
    removeReportedViewCasts: (
      state: UserActionState,
      action: PayloadAction<Array<string>>,
    ) => {
      const reportedViewCastsLength = action.payload.length;
      state.unreportedViewCasts = state.unreportedViewCasts.slice(
        reportedViewCastsLength,
      );
      storeUnreportedViewCasts(state.unreportedViewCasts);
    },
    setUnreportedViewCastsSubmitStatus: (
      state: UserActionState,
      action: PayloadAction<AsyncRequestStatus>,
    ) => {
      state.unreportedViewCastsSubmitStatus = action.payload;
    },
  },
});

const { actions, reducer } = userActionSlice;
export const {
  setActionPointConfig,
  setActionPointConfigRequestStatus,
  setTotalPoints,
  setTotalPointsRequestStatus,
  plusPoint,
  addOneToUnreportedActions,
  removeReportedActions,
  setUnreportedActionsSubmitStatus,
  addOneToUnreportedViewCasts,
  removeReportedViewCasts,
  setUnreportedViewCastsSubmitStatus,
} = actions;
export const selectUserAction = (state: RootState) => state.userAction;
export default reducer;
