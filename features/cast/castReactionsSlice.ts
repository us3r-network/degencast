import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

export type CastReactionsState = {
  recastCasts: Array<string>;
};

const castReactionsState: CastReactionsState = {
  recastCasts: [],
};

export const castReactionsSlice = createSlice({
  name: "castReactions",
  initialState: castReactionsState,
  reducers: {
    addRecast: (state, action: PayloadAction<string>) => {
      state.recastCasts.push(action.payload);
    },
    removeRecast: (state, action: PayloadAction<string>) => {
      state.recastCasts = state.recastCasts.filter(
        (recast) => recast !== action.payload,
      );
    },
  },
});

const { actions, reducer } = castReactionsSlice;
export const { addRecast, removeRecast } = actions;
export const selectCastReactions = (state: RootState) => state.castReactions;
export default reducer;
