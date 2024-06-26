import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

const defaultReactions = {
  liked: false,
  recasted: false,
  likesCount: 0,
  recastsCount: 0,
};
type Reactions = {
  liked: boolean;
  recasted: boolean;
  likesCount: number;
  recastsCount: number;
};
export type CastReactionsState = {
  reactions: {
    [castHex: string]: Reactions;
  };
  likePendingCastIds: Array<string>;
  recastPendingCastIds: Array<string>;
};

const castReactionsState: CastReactionsState = {
  reactions: {},
  likePendingCastIds: [],
  recastPendingCastIds: [],
};

export const castReactionsSlice = createSlice({
  name: "castReactions",
  initialState: castReactionsState,
  reducers: {
    addLike: (state, action: PayloadAction<string>) => {
      const castHex = action.payload;
      const reactions = state.reactions[castHex] || { ...defaultReactions };
      reactions.liked = true;
      reactions.likesCount += 1;
      state.reactions[castHex] = { ...reactions };
    },
    removeLike: (state, action: PayloadAction<string>) => {
      const castHex = action.payload;
      const reactions = state.reactions[castHex] || { ...defaultReactions };
      reactions.liked = false;
      reactions.likesCount = Math.max(0, reactions.likesCount - 1);
      state.reactions[castHex] = { ...reactions };
    },
    addLikePending: (state, action: PayloadAction<string>) => {
      state.likePendingCastIds.push(action.payload);
    },
    removeLikePending: (state, action: PayloadAction<string>) => {
      state.likePendingCastIds = state.likePendingCastIds.filter(
        (like) => like !== action.payload,
      );
    },
    addRecast: (state, action: PayloadAction<string>) => {
      const castHex = action.payload;
      const reactions = state.reactions[castHex] || { ...defaultReactions };
      state.reactions[castHex] = { ...reactions, recasted: true };
    },
    removeRecast: (state, action: PayloadAction<string>) => {
      const castHex = action.payload;
      const reactions = state.reactions[castHex] || { ...defaultReactions };
      state.reactions[castHex] = { ...reactions, recasted: false };
    },
    addRecastPending: (state, action: PayloadAction<string>) => {
      state.recastPendingCastIds.push(action.payload);
    },
    removeRecastPending: (state, action: PayloadAction<string>) => {
      state.recastPendingCastIds = state.recastPendingCastIds.filter(
        (recast) => recast !== action.payload,
      );
    },
    upsertManyToReactions: (
      state,
      action: PayloadAction<{
        [castHex: string]: Reactions;
      }>,
    ) => {
      state.reactions = {
        ...state.reactions,
        ...action.payload,
      };
    },
  },
});

const { actions, reducer } = castReactionsSlice;
export const {
  addLike,
  removeLike,
  addLikePending,
  removeLikePending,
  addRecast,
  removeRecast,
  addRecastPending,
  removeRecastPending,
  upsertManyToReactions,
} = actions;
export const selectCastReactions = (state: RootState) => state.castReactions;
export default reducer;
