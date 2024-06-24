import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { fetchCastWithHash } from "~/services/farcaster/neynar/farcaster";
import { NeynarCast } from "~/services/farcaster/types/neynar";
type embedCastsState = {
  casts: {
    [castHash: string]: NeynarCast;
  };
  pendingCasts: string[];
  rejectedCasts: string[];
};

const castCollectionState: embedCastsState = {
  casts: {},
  pendingCasts: [],
  rejectedCasts: [],
};

export const fetchEmbedCasts = createAsyncThunk<
  NeynarCast,
  {
    embedCastIds: Array<{
      fid: number;
      hash: string;
    }>;
  }
>(
  "embedCasts/fetchEmbedCastss",
  async ({ embedCastIds }, { rejectWithValue, getState }) => {
    const resp = await fetchCastWithHash({
      hash: embedCastIds[0].hash,
    });

    const { cast } = resp;
    return cast;
  },
  {
    condition: ({ embedCastIds }, { getState }) => {
      const { embedCasts } = getState() as RootState;
      const { casts, pendingCasts, rejectedCasts } = embedCasts;
      const castHash = embedCastIds[0].hash;
      if (casts[castHash]) {
        return false;
      }
      if (pendingCasts.includes(castHash)) {
        return false;
      }
      if (rejectedCasts.includes(castHash)) {
        return false;
      }
      return true;
    },
  },
);

export const castCollectionSlice = createSlice({
  name: "castCollection",
  initialState: castCollectionState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEmbedCasts.pending, (state, action) => {
        const { embedCastIds } = action.meta.arg;
        state.pendingCasts.push(embedCastIds[0].hash);
      })
      .addCase(fetchEmbedCasts.fulfilled, (state, action) => {
        const { embedCastIds } = action.meta.arg;
        const castHash = embedCastIds[0].hash;
        state.casts[castHash] = action.payload;
        state.pendingCasts = state.pendingCasts.filter(
          (hash) => hash !== castHash,
        );
      })
      .addCase(fetchEmbedCasts.rejected, (state, action) => {
        const { embedCastIds } = action.meta.arg;
        const castHash = embedCastIds[0].hash;
        state.pendingCasts = state.pendingCasts.filter(
          (hash) => hash !== castHash,
        );
        state.rejectedCasts.push(castHash);
      });
  },
});

const { actions, reducer } = castCollectionSlice;
export const selectEmbedCasts = (state: RootState) => state.embedCasts;
export default reducer;
