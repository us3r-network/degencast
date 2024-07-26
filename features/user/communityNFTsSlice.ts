import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ApiResp,
  ApiRespCode,
  AsyncRequestStatus,
} from "~/services/shared/types";
import { ERC42069Token } from "~/services/trade/types";
import { myNFTs } from "~/services/user/api";
import type { RootState } from "../../store/store";

type UserCommunityNFTState = {
  cache: Map<`0x${string}`, ApiResp<ERC42069Token[]>>;
  address?: `0x${string}`;
  items: ERC42069Token[];
  status: AsyncRequestStatus;
  error: string | undefined;
};

const initialUserCommunityNFTState: UserCommunityNFTState = {
  cache: new Map(),
  address: undefined,
  items: [],
  status: AsyncRequestStatus.IDLE,
  error: undefined,
};

export const fetchItems = createAsyncThunk(
  "userCommunityNFTs/fetchItems",
  async (address: `0x${string}`, thunkAPI) => {
    const { userCommunityNFTs } = thunkAPI.getState() as {
      userCommunityNFTs: UserCommunityNFTState;
    };
    if (userCommunityNFTs.address !== address) {
      const existCache = userCommunityNFTs.cache.get(address);
      if (existCache?.data) return existCache;
    }
    const response = await myNFTs(address);
    return response.data;
  },
);

export const userCommunityNFTSlice = createSlice({
  name: "userCommunityNFTs",
  initialState: initialUserCommunityNFTState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchItems.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        const address = action.meta.arg;
        if (state.address !== address) {
          state.address = address;
          state.items = initialUserCommunityNFTState.items;
          state.error = initialUserCommunityNFTState.error;
          state.status = initialUserCommunityNFTState.status;
        }
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        if (action.payload.code == ApiRespCode.SUCCESS) {
          state.cache.set(action.meta.arg, action.payload);
        }
        state.items = action.payload.data
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.error = action.error.message;
      });
  },
});
export const selectUserCommunityNFTs = (state: RootState) =>
  state.userCommunityNFTs;
export default userCommunityNFTSlice.reducer;
