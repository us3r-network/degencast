import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

export type CastAttTokenState = {
  attTokens: {
    [channelId: string]: AttentionTokenEntity;
  };
};

const castAttTokenState: CastAttTokenState = {
  attTokens: {},
};

export const castAttTokenSlice = createSlice({
  name: "castATTToken",
  initialState: castAttTokenState,
  reducers: {
    upsertOneToAttTokens: (
      state,
      action: PayloadAction<{
        channelId: string;
        tokenInfo: AttentionTokenEntity;
      }>,
    ) => {
      state.attTokens[action.payload.channelId] = action.payload.tokenInfo;
    },
  },
});

const { actions, reducer } = castAttTokenSlice;
export const { upsertOneToAttTokens } = actions;
export const selectCastAttToken = (state: RootState) => state.castAttToken;
export default reducer;
