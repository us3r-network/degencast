/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:44:32
 * @Description: store
 */

import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import joinCommunity from "~/features/community/joinCommunitySlice";
import warpcastChannels from "~/features/community/warpcastChannelsSlice";
import communityRank from "~/features/trade/communityRankSlice";
import communityShares from "~/features/trade/communitySharesSlice";
import communityTokens from "~/features/trade/communityTokensSlice";
import userCommunityShares from "~/features/user/communitySharesSlice";
import userCommunityTokens from "~/features/user/communityTokensSlice";
import userAction from "~/features/user/userActionSlice";
import inviteCode from "~/features/user/inviteCodeSlice";
import userAuth from "~/features/user/userAuthSlice";
import castPage from "~/features/cast/castPageSlice";
import channelExplorePage from "~/features/community/channelExplorePageSlice";
import communityDetail from "~/features/community/communityDetailSlice";
// import userTips from "~/features/user/tipsSlice";

enableMapSet();

export const store = configureStore({
  reducer: {
    joinCommunity,
    userAction,
    inviteCode,
    userAuth,
    warpcastChannels,
    castPage,
    communityTokens,
    communityShares,
    communityRank,
    userCommunityTokens,
    userCommunityShares,
    channelExplorePage,
    communityDetail,
    // userTips,
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
