import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { cloneDeep } from "lodash";
import {
  ZoraCollectionEntity,
  ZoraCollectionType,
} from "~/services/zora-collection/types";
import {
  getZoraCollections,
  postZoraCollection,
} from "~/services/zora-collection/api";

type CastCollectionState = {
  collections: {
    [creatorAddress: string]: Array<ZoraCollectionEntity>;
  };
  status: AsyncRequestStatus;
  errorMsg: string;
  postCollectionStatus: AsyncRequestStatus;
  postCollectionErrorMsg: string;
};

const castCollectionState: CastCollectionState = {
  collections: {},
  status: AsyncRequestStatus.IDLE,
  errorMsg: "",
  postCollectionStatus: AsyncRequestStatus.IDLE,
  postCollectionErrorMsg: "",
};

export const fetchCastCollections = createAsyncThunk<
  Array<ZoraCollectionEntity>,
  {
    chainId: number;
    creatorAddress: string;
  }
>(
  "castCollection/fetchCastCollections",
  async ({ chainId, creatorAddress }, { rejectWithValue, getState }) => {
    const resp = await getZoraCollections({
      type: ZoraCollectionType.CAST,
      chainId,
      creatorAddress,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: ({ creatorAddress, chainId }, { getState }) => {
      if (!creatorAddress || !chainId) {
        return false;
      }
      const state = getState() as RootState;
      const { castCollection } = state;
      const { collections } = castCollection;
      const data = collections[creatorAddress];
      const findCollection = data?.find(
        (collection) =>
          collection.creatorAddress === creatorAddress &&
          collection.chainId === chainId,
      );
      if (findCollection) {
        return false;
      }
      return true;
    },
  },
);

export const postCastCollection = createAsyncThunk<
  ZoraCollectionEntity,
  {
    chainId: number;
    creatorAddress: string;
    contractMetadataURI: string;
    contractAddress: string;
  }
>(
  "castCollection/postCastCollection",
  async (
    { chainId, creatorAddress, contractMetadataURI, contractAddress },
    { rejectWithValue, getState },
  ) => {
    const resp = await postZoraCollection({
      type: ZoraCollectionType.CAST,
      chainId,
      creatorAddress,
      contractMetadataURI,
      contractAddress,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
);

export const castCollectionSlice = createSlice({
  name: "castCollection",
  initialState: castCollectionState,
  reducers: {
    upsertToCastCollection: (
      state,
      action: PayloadAction<ZoraCollectionEntity>,
    ) => {
      const collection = action.payload;
      const { creatorAddress, chainId, contractAddress, type } = collection;
      if (!state.collections[creatorAddress]) {
        state.collections[creatorAddress] = [];
      }
      const collections = cloneDeep(state.collections[creatorAddress]);
      const index = collections.findIndex(
        (item) =>
          item.contractAddress === contractAddress &&
          item.chainId === chainId &&
          item.type === type &&
          item.creatorAddress === creatorAddress,
      );
      if (index === -1) {
        state.collections[creatorAddress].push(collection);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCastCollections.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchCastCollections.fulfilled, (state, action) => {
        const { creatorAddress } = action.meta.arg;
        if (!state.collections[creatorAddress]) {
          state.collections[creatorAddress] = [];
        }
        state.collections[creatorAddress] = action.payload;
        state.status = AsyncRequestStatus.FULFILLED;
      })
      .addCase(fetchCastCollections.rejected, (state, action) => {
        state.errorMsg = action.error.message || "";
        state.status = AsyncRequestStatus.REJECTED;
      })
      .addCase(postCastCollection.pending, (state, action) => {
        state.postCollectionStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(postCastCollection.fulfilled, (state, action) => {
        const collection = action.payload;
        const { creatorAddress } = collection;
        if (!state.collections[creatorAddress]) {
          state.collections[creatorAddress] = [];
        }
        state.collections[creatorAddress].push(collection);
        state.postCollectionStatus = AsyncRequestStatus.FULFILLED;
      })
      .addCase(postCastCollection.rejected, (state, action) => {
        state.postCollectionErrorMsg = action.error.message || "";
        state.postCollectionStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { actions, reducer } = castCollectionSlice;
export const { upsertToCastCollection } = actions;
export const selectCastCollection = (state: RootState) => state.castCollection;
export default reducer;
