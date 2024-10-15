import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import {
  UserActionData,
  UserActionName,
  UserActionPointConfig,
} from "~/services/user/types";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import {
  getActionPointConfig,
  getUserPoints,
  postUserActions,
} from "~/services/user/api";
import getActionPoint from "~/utils/action/getActionPoint";
import { postSeenCasts } from "~/services/farcaster/api";
import { computeHmac } from "~/utils/hmac";
import { HTTP_HMAC_KEY } from "~/constants";

export const keyPrefix = "degencast";
export const unreportedActionsKey = `${keyPrefix}:unreportedActions`;
export const unreportedViewCastsKey = `${keyPrefix}:unreportedViewCasts`;
export const actionDailyLimitKey = `${keyPrefix}:actionDailyLimit`;

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

export const getStoredActionDailyLimit = () => {
  try {
    const actionDailyLimit = localStorage.getItem(actionDailyLimitKey);
    return actionDailyLimit ? JSON.parse(actionDailyLimit) : {};
  } catch (error) {
    return {};
  }
};

export const storeActionDailyLimit = (actionDailyLimit: any) => {
  localStorage.setItem(actionDailyLimitKey, JSON.stringify(actionDailyLimit));
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
  likeActions: Array<UserActionData>;
  likeActionsPendingCastHashes: Array<string>;
  reportedActions: Array<UserActionData>;
  reportPendingActions: Array<UserActionData>;
  reportedViewCasts: Array<string>;
  reportPendingViewCasts: Array<string>;
  dailyLimit: {
    [key: string]: {
      [actionName: string]: number;
    };
  };
};

const defaultActionPointConfig: UserActionPointConfig = {
  Share: { unit: 500 },
  View: { unit: 1, dailyLimit: 30 },
  Like: { unit: 1, dailyLimit: 30 },
  UnLike: { unit: -1 },
  Tips: { unit: 5 },
  ConnectFarcaster: { unit: 200 },
  BuyChannelShare: { unit: 500 },
  Invite: { unit: 200 },
  SwapToken: { unit: 500 },
  MintCast: { unit: 100 },
  ViewChannel: { unit: 1, dailyLimit: 10 },
  VoteCast: { unit: 100 },
  PostingSignature: { unit: 10 },
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
  likeActions: [],
  likeActionsPendingCastHashes: [],
  reportedActions: [],
  reportPendingActions: [],
  reportedViewCasts: [],
  reportPendingViewCasts: [],
  dailyLimit: getStoredActionDailyLimit(),
};

const getYearMonthDay = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
const dailyLimitKey = getYearMonthDay();

export const fetchTotalPoints = createAsyncThunk<number>(
  "userAction/fetchTotalPoints",
  async (args, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const resp = await getUserPoints();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data?.value || 0;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (args, { getState }) => {
      const state = getState() as RootState;
      const { userAction } = state;
      const { totalPointsRequestStatus } = userAction;
      if (totalPointsRequestStatus === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  },
);

export const fetchUserActionConfig = createAsyncThunk<UserActionPointConfig>(
  "userAction/fetchUserActionConfig",
  async (args, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const resp = await getActionPointConfig();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (args, { getState }) => {
      const state = getState() as RootState;
      const { userAction } = state;
      const { actionPointConfigRequestStatus } = userAction;
      if (actionPointConfigRequestStatus === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  },
);

export const submitAction = createAsyncThunk<UserActionData, UserActionData>(
  "userAction/submitAction",
  async (actionData, { rejectWithValue, getState }) => {
    if (!HTTP_HMAC_KEY) {
      console.error("HTTP_HMAC_KEY is empty");
      return rejectWithValue(new Error("HTTP_HMAC_KEY is empty"));
    }
    const state = getState() as RootState;
    const { userAuth } = state;
    const { degencastId } = userAuth;
    const hmac = await computeHmac(
      `${HTTP_HMAC_KEY}${degencastId}`,
      JSON.stringify([actionData]),
    );
    const resp = await postUserActions([actionData], hmac);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return actionData;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (actionData, { getState }) => {
      const state = getState() as RootState;
      const { userAction, userAuth } = state;
      const {
        reportedActions,
        reportPendingActions,
        dailyLimit,
        actionPointConfig,
      } = userAction;
      const { degencastId } = userAuth;
      if (!degencastId) {
        return false;
      }
      const configDailyLimit =
        actionPointConfig?.[actionData.action]?.dailyLimit;
      if (configDailyLimit) {
        const actionCount =
          dailyLimit?.[dailyLimitKey]?.[actionData.action] || 0;
        if (actionCount >= configDailyLimit) {
          return false;
        }
      }
      if (actionData.action === UserActionName.View) {
        const findReportedAction = reportedActions.find(
          (item) => item.castHash === actionData.castHash,
        );
        const findReportPendingAction = reportPendingActions.find(
          (item) => item.castHash === actionData.castHash,
        );
        if (findReportedAction || findReportPendingAction) {
          return false;
        }
      }
      return true;
    },
  },
);

export const submitUnreportedActions = createAsyncThunk<Array<UserActionData>>(
  "userAction/submitUnreportedActions",
  async (args, { rejectWithValue, getState }) => {
    if (!HTTP_HMAC_KEY) {
      console.error("HTTP_HMAC_KEY is empty");
      return rejectWithValue(new Error("HTTP_HMAC_KEY is empty"));
    }
    const state = getState() as RootState;
    const { userAction, userAuth } = state;
    const { unreportedActions } = userAction;
    const { degencastId } = userAuth;
    const hmac = await computeHmac(
      `${HTTP_HMAC_KEY}${degencastId}`,
      JSON.stringify(unreportedActions),
    );
    const resp = await postUserActions(unreportedActions, hmac);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return unreportedActions;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (actionData, { getState }) => {
      const state = getState() as RootState;
      const { userAction, userAuth } = state;
      const { unreportedActions, unreportedActionsSubmitStatus } = userAction;
      const { degencastId } = userAuth;
      if (!degencastId) {
        return false;
      }
      if (
        unreportedActions.length === 0 ||
        unreportedActionsSubmitStatus === AsyncRequestStatus.PENDING
      ) {
        return false;
      }
      return true;
    },
  },
);

export const submitSeenCast = createAsyncThunk<string, string>(
  "userAction/submitSeenCast",
  async (castHex, { rejectWithValue, getState }) => {
    const resp = await postSeenCasts([castHex]);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return castHex;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (castHex, { getState }) => {
      const state = getState() as RootState;
      const { userAction } = state;
      const { reportedViewCasts, reportPendingViewCasts } = userAction;
      if (
        reportedViewCasts.includes(castHex) ||
        reportPendingViewCasts.includes(castHex)
      ) {
        return false;
      }
      return true;
    },
  },
);

export const submitUnreportedViewCasts = createAsyncThunk<Array<string>>(
  "userAction/submitUnreportedViewCasts",
  async (args, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { userAction } = state;
    const { unreportedViewCasts } = userAction;
    const resp = await postSeenCasts(unreportedViewCasts);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return unreportedViewCasts;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (args, { getState }) => {
      const state = getState() as RootState;
      const { userAction } = state;
      const { unreportedViewCasts, unreportedViewCastsSubmitStatus } =
        userAction;
      if (
        unreportedViewCasts.length === 0 ||
        unreportedViewCastsSubmitStatus === AsyncRequestStatus.PENDING
      ) {
        return false;
      }
      return true;
    },
  },
);

export const userActionSlice = createSlice({
  name: "userAction",
  initialState: userActionState,
  reducers: {
    addOneToUnreportedActions: (
      state: UserActionState,
      action: PayloadAction<UserActionData>,
    ) => {
      const actionData = action.payload;
      const { unreportedActions, actionPointConfig, dailyLimit } = state;
      const configDailyLimit =
        actionPointConfig?.[actionData.action]?.dailyLimit;
      const actionCount = dailyLimit?.[dailyLimitKey]?.[actionData.action] || 0;
      if (!configDailyLimit || actionCount < configDailyLimit) {
        // 更新dailyLimit
        const newDailyLimit = {
          ...state.dailyLimit,
          [dailyLimitKey]: {
            ...(state.dailyLimit?.[dailyLimitKey] || {}),
            [actionData.action]: actionCount + 1,
          },
        };
        if (actionData.action === UserActionName.View) {
          const findAction = unreportedActions.find(
            (item) => item.castHash === actionData.castHash,
          );
          if (!findAction) {
            state.unreportedActions.push(action.payload);
            state.dailyLimit = newDailyLimit;
          }
        } else {
          state.unreportedActions.push(action.payload);
          state.dailyLimit = newDailyLimit;
        }

        storeUnreportedActions(state.unreportedActions);
        storeActionDailyLimit(state.dailyLimit);
      }
    },
    addOneToReportedActions: (
      state: UserActionState,
      action: PayloadAction<UserActionData>,
    ) => {
      const { dailyLimit, actionPointConfig } = state;
      const actionData = action.payload;
      const point = getActionPoint(actionData, actionPointConfig);
      state.totalPoints += point;

      // 更新dailyLimit
      const actionCount = dailyLimit?.[dailyLimitKey]?.[actionData.action] || 0;
      const newDailyLimit = {
        ...state.dailyLimit,
        [dailyLimitKey]: {
          ...(state.dailyLimit?.[dailyLimitKey] || {}),
          [actionData.action]: actionCount + 1,
        },
      };
      state.dailyLimit = newDailyLimit;
      storeActionDailyLimit(state.dailyLimit);
    },
    addOneToUnreportedViewCasts: (
      state: UserActionState,
      action: PayloadAction<string>,
    ) => {
      const castHex = action.payload;
      const { unreportedViewCasts } = state;
      if (!unreportedViewCasts.includes(castHex)) {
        state.unreportedViewCasts.push(castHex);
        storeUnreportedViewCasts(state.unreportedViewCasts);
      }
    },
    addManyToLikeActions: (
      state: UserActionState,
      action: PayloadAction<Array<UserActionData>>,
    ) => {
      state.likeActions = state.likeActions.concat(action.payload);
    },
    removeOneFromLikeActions: (
      state: UserActionState,
      action: PayloadAction<string>,
    ) => {
      state.likeActions = state.likeActions.filter(
        (likeAction) => likeAction.castHash !== action.payload,
      );
    },
    addOneToLikeActionsPendingCastHashes: (
      state: UserActionState,
      action: PayloadAction<string>,
    ) => {
      state.likeActionsPendingCastHashes.push(action.payload);
    },
    removeOneFromLikeActionsPendingCastHashes: (
      state: UserActionState,
      action: PayloadAction<string>,
    ) => {
      state.likeActionsPendingCastHashes =
        state.likeActionsPendingCastHashes.filter(
          (castHash) => castHash !== action.payload,
        );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTotalPoints.pending, (state, action) => {
        state.actionPointConfigRequestStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchTotalPoints.fulfilled, (state, action) => {
        state.totalPoints = action.payload;
        state.actionPointConfigRequestStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchTotalPoints.rejected, (state, action) => {
        state.actionPointConfigRequestStatus = AsyncRequestStatus.REJECTED;
      })
      .addCase(fetchUserActionConfig.pending, (state, action) => {
        state.actionPointConfigRequestStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchUserActionConfig.fulfilled, (state, action) => {
        state.actionPointConfig = {
          ...defaultActionPointConfig,
          ...action.payload,
        };
        state.actionPointConfigRequestStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchUserActionConfig.rejected, (state, action) => {
        state.actionPointConfigRequestStatus = AsyncRequestStatus.REJECTED;
      })
      .addCase(submitAction.pending, (state, action) => {
        const { dailyLimit, actionPointConfig } = state;
        const actionData = action.meta.arg;
        if (actionData.action === UserActionName.View) {
          state.reportPendingActions.push(actionData);
          // 刷cast时乐观处理
          const point = getActionPoint(actionData, actionPointConfig);
          state.totalPoints += point;

          // 更新dailyLimit
          const actionCount =
            dailyLimit?.[dailyLimitKey]?.[actionData.action] || 0;
          const newDailyLimit = {
            ...state.dailyLimit,
            [dailyLimitKey]: {
              ...(state.dailyLimit?.[dailyLimitKey] || {}),
              [actionData.action]: actionCount + 1,
            },
          };
          state.dailyLimit = newDailyLimit;
          storeActionDailyLimit(state.dailyLimit);
        }
      })
      .addCase(submitAction.fulfilled, (state, action) => {
        const { dailyLimit, actionPointConfig } = state;
        const actionData = action.meta.arg;
        if (actionData.action === UserActionName.View) {
          state.reportedActions.push(actionData);
          state.reportPendingActions = state.reportPendingActions.filter(
            (item) => item.castHash !== actionData.castHash,
          );
          // 刷cast时已经乐观处理
          return;
        }
        const point = getActionPoint(actionData, actionPointConfig);
        state.totalPoints += point;

        // 更新dailyLimit
        const actionCount =
          dailyLimit?.[dailyLimitKey]?.[actionData.action] || 0;
        const newDailyLimit = {
          ...state.dailyLimit,
          [dailyLimitKey]: {
            ...(state.dailyLimit?.[dailyLimitKey] || {}),
            [actionData.action]: actionCount + 1,
          },
        };
        state.dailyLimit = newDailyLimit;
        storeActionDailyLimit(state.dailyLimit);
      })
      .addCase(submitAction.rejected, (state, action) => {
        const actionData = action.meta.arg;
        if (actionData.action === UserActionName.View) {
          state.reportPendingActions = state.reportPendingActions.filter(
            (item) => item.castHash !== actionData.castHash,
          );
        }
      })
      .addCase(submitUnreportedActions.pending, (state, action) => {
        state.unreportedActionsSubmitStatus = AsyncRequestStatus.PENDING;
        const { unreportedActions } = state;
        for (const actionData of unreportedActions) {
          if (actionData.action === UserActionName.View) {
            state.reportPendingActions.push(actionData);
          }
        }
      })
      .addCase(submitUnreportedActions.fulfilled, (state, action) => {
        const { unreportedActions } = state;
        for (const actionData of unreportedActions) {
          if (actionData.action === UserActionName.View) {
            state.reportedActions.push(actionData);
            state.reportPendingActions = state.reportPendingActions.filter(
              (item) => item.castHash !== actionData.castHash,
            );
          }
        }
        state.unreportedActions = [];
        storeUnreportedActions([]);
        state.unreportedActionsSubmitStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(submitUnreportedActions.rejected, (state, action) => {
        const { unreportedActions } = state;
        for (const actionData of unreportedActions) {
          if (actionData.action === UserActionName.View) {
            state.reportedActions.push(actionData);
            state.reportPendingActions = state.reportPendingActions.filter(
              (item) => item.castHash !== actionData.castHash,
            );
          }
        }
        state.unreportedActionsSubmitStatus = AsyncRequestStatus.REJECTED;
      })
      .addCase(submitSeenCast.pending, (state, action) => {
        const castHex = action.meta.arg;
        state.reportPendingViewCasts.push(castHex);
      })
      .addCase(submitSeenCast.fulfilled, (state, action) => {
        const castHex = action.meta.arg;
        state.reportedViewCasts.push(castHex);
        state.reportPendingViewCasts = state.reportPendingViewCasts.filter(
          (item) => item !== castHex,
        );
      })
      .addCase(submitSeenCast.rejected, (state, action) => {
        const castHex = action.meta.arg;
        state.reportPendingViewCasts = state.reportPendingViewCasts.filter(
          (item) => item !== castHex,
        );
      })
      .addCase(submitUnreportedViewCasts.pending, (state, action) => {
        state.unreportedViewCastsSubmitStatus = AsyncRequestStatus.PENDING;
        const { unreportedViewCasts } = state;
        for (const castHex of unreportedViewCasts) {
          state.reportPendingViewCasts.push(castHex);
        }
      })
      .addCase(submitUnreportedViewCasts.fulfilled, (state, action) => {
        const { unreportedViewCasts } = state;
        for (const castHex of unreportedViewCasts) {
          state.reportedViewCasts.push(castHex);
          state.reportPendingViewCasts = state.reportPendingViewCasts.filter(
            (item) => item !== castHex,
          );
        }
        state.unreportedViewCasts = [];
        storeUnreportedViewCasts([]);
        state.unreportedViewCastsSubmitStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(submitUnreportedViewCasts.rejected, (state, action) => {
        const { unreportedViewCasts } = state;
        for (const castHex of unreportedViewCasts) {
          state.reportPendingViewCasts = state.reportPendingViewCasts.filter(
            (item) => item !== castHex,
          );
        }
        state.unreportedViewCastsSubmitStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = userActionSlice;
export const {
  addOneToUnreportedActions,
  addOneToUnreportedViewCasts,
  addManyToLikeActions,
  removeOneFromLikeActions,
  addOneToLikeActionsPendingCastHashes,
  removeOneFromLikeActionsPendingCastHashes,
  addOneToReportedActions,
} = actions;
export const selectUserAction = (state: RootState) => state.userAction;
export default reducer;
