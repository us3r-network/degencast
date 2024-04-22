/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:44:32
 * @Description: store
 */
import { configureStore } from "@reduxjs/toolkit";
import joinCommunity from "~/features/community/joinCommunitySlice";
import warpcastChannels from "~/features/community/warpcastChannelsSlice";
import userAction from "~/features/user/userActionSlice";
import castPage from "~/features/cast/castPageSlice";
import communityTokens from "~/features/trade/communityTokensSlice";
import communityShares from "~/features/trade/communitySharesSlice";
import communityRank from "~/features/trade/communityRankSlice";

export const store = configureStore({
  reducer: {
    joinCommunity,
    userAction,
    warpcastChannels,
    castPage,
    communityTokens,
    communityShares,
    communityRank,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
