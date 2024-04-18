import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";

export enum CastDetailDataOrigin {
  Explore,
  Comments,
  Community,
  Protfolio,
  Created,
}

export type CastDetailData = {
  origin: CastDetailDataOrigin;
  cast: FarCast;
  farcasterUserDataObj: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
};
type castPageState = {
  castDetailData: {
    [key: string]: CastDetailData;
  };
};

const castPageState: castPageState = {
  castDetailData: {},
};

export const castPageSlice = createSlice({
  name: "castPage",
  initialState: castPageState,
  reducers: {
    upsertToCastDetailData: (
      state: castPageState,
      action: PayloadAction<{
        id: string;
        params: CastDetailData;
      }>,
    ) => {
      state.castDetailData[action.payload.id] = action.payload.params;
    },
  },
});

const { actions, reducer } = castPageSlice;
export const { upsertToCastDetailData } = actions;
export const selectCastPage = (state: RootState) => state.castPage;
export default reducer;
