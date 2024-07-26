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
import communityRank from "~/features/rank/communityRankSlice";
import tokenRank from "~/features/rank/tokenRankSlice";
import curatorRank from "~/features/rank/curatorRankSlice";
import communityTokens from "~/features/trade/communityTokensSlice";
import userChannels from "~/features/user/userChannelsSlice";
import userCasts from "~/features/user/userCastsSlice";
import userCurationCasts from "~/features/user/userCurationCastsSlice";
import userHostChannels from "~/features/user/userHostChannelsSlice";
import userCommunityTokens from "~/features/user/communityTokensSlice";
import userCommunityNFTs from "~/features/user/communityNFTsSlice";
import userAction from "~/features/user/userActionSlice";
import inviteCode from "~/features/user/inviteCodeSlice";
import userAuth from "~/features/user/userAuthSlice";
import castPage from "~/features/cast/castPageSlice";
import castReactions from "~/features/cast/castReactionsSlice";
import embedCasts from "~/features/cast/embedCastsSlice";
import castCollection from "~/features/cast/castCollectionSlice";
import channelExplorePage from "~/features/community/channelExplorePageSlice";
import communityDetail from "~/features/community/communityDetailSlice";
import communityDetailTipsRank from "~/features/community/communityDetailTipsRankSlice";
import communityDetailShares from "~/features/community/communityDetailSharesSlice";
import communityDetailCasts from "~/features/community/communityDetailCastsSlice";
import communityShareStatistics from "~/features/community/communityShareStatisticsSlice";
import communityTrending from "~/features/community/communityTrendingSlice";
import coverChannels from "~/features/community/coverChannelsSlice";
import exploreTrendingChannels from "~/features/community/exploreTrendingChannelsSlice";
import exploreFollowingChannels from "~/features/community/exploreFollowingChannelsSlice";
import exploreHostingChannels from "~/features/community/exploreHostingChannelsSlice";
import appSettings from "~/features/appSettingsSlice";
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
    castCollection,
    communityTokens,
    communityRank,
    tokenRank,
    curatorRank,
    userCommunityTokens,
    userCommunityNFTs,
    userChannels,
    userCasts,
    userCurationCasts,
    userHostChannels,
    channelExplorePage,
    communityDetail,
    communityDetailTipsRank,
    communityDetailShares,
    communityDetailCasts,
    communityShareStatistics,
    communityTrending,
    coverChannels,
    exploreTrendingChannels,
    exploreFollowingChannels,
    exploreHostingChannels,
    castReactions,
    embedCasts,
    appSettings,
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
