import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export enum ChannelExploreDataOrigin {
  Explore,
  Comments,
  Community,
  Protfolio,
  Created,
}

export type ChannelExploreData = {
  origin: ChannelExploreDataOrigin;
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: {
    [fid: string]: UserData;
  };
  community?: CommunityInfo;
};

type channelExplorePageState = {
  channelExploreData: {
    [channelId: string]: ChannelExploreData;
  };
};

const channelExplorePageState: channelExplorePageState = {
  channelExploreData: {},
};

export const channelExplorePageSlice = createSlice({
  name: "channelExplorePage",
  initialState: channelExplorePageState,
  reducers: {
    upsertChannelExploreData: (
      state: channelExplorePageState,
      action: PayloadAction<{
        id: string;
        params: ChannelExploreData;
      }>,
    ) => {
      state.channelExploreData[action.payload.id] = action.payload.params;
    },
  },
});

const { actions, reducer } = channelExplorePageSlice;
export const { upsertChannelExploreData } = actions;
export const selectChannelExplorePage = (state: RootState) =>
  state.channelExplorePage;
export default reducer;
