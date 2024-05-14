import axios, { AxiosPromise } from "axios";
import { FARCASTER_API_URL } from "~/constants";
import request, { RequestPromise } from "~/services/shared/api/request";
import {
  ApiResp,
  FarCast,
  FarCastEmbedMetaV2,
  ProfileFeedsDataItem,
  ProfileFeedsGroups,
  ProfileFeedsPageInfo,
  SocialPlatform,
} from "../types";
import { CommunityInfo } from "~/services/community/types/community";
import { UserActionData } from "~/services/user/types";

export type FarcasterPageInfo = {
  startIndex: number;
  endIndex: number;
  endFarcasterCursor: number;
  hasNextPage: boolean;
};

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};
export type TrendingCastData = {
  community: CommunityInfo;
  data: any;
  platform: SocialPlatform;
};
export function getFarcasterTrending({
  start,
  end,
  least,
}: {
  start: number;
  end: number;
  least?: number;
}): RequestPromise<
  ApiResp<{
    casts: Array<TrendingCastData>;
    farcasterUserData: Array<FarcasterUserData>;
    pageInfo: FarcasterPageInfo;
    likeActions: Array<UserActionData>;
  }>
> {
  return request({
    url: `/topics/casts/trending`,
    method: "get",
    headers: {
      needToken: true,
    },
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
    },
  });
}

export type NaynarFarcasterTrendingPageInfo = {
  cursor: string;
  hasNextPage: boolean;
};
export function getNaynarFarcasterTrending({
  cursor,
  limit,
  least,
}: {
  cursor: string;
  limit: number;
  least?: number;
}): RequestPromise<
  ApiResp<{
    casts: Array<TrendingCastData>;
    farcasterUserData: Array<FarcasterUserData>;
    pageInfo: NaynarFarcasterTrendingPageInfo;
    likeActions: Array<UserActionData>;
  }>
> {
  return request({
    url: `/topics/casts/naynar-trending`,
    method: "get",
    headers: {
      needToken: true,
    },
    params: {
      cursor,
      limit,
      ...(least ? { least } : {}),
    },
  });
}

export type ChannelCastData = {
  data: any;
  platform: SocialPlatform;
};
export type ChannelTrendingCastData = {
  casts: Array<ChannelCastData>;
  farcasterUserData: Array<FarcasterUserData>;
  pageInfo: FarcasterPageInfo;
  likeActions: Array<UserActionData>;
};
export function getFarcasterTrendingWithChannelId({
  start,
  end,
  least,
  channelId,
}: {
  start: number;
  end: number;
  least?: number;
  channelId: string;
}): RequestPromise<ApiResp<ChannelTrendingCastData>> {
  return request({
    url: `/3r-farcaster/trending`,
    method: "get",
    headers: {
      needToken: true,
    },
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
      channelId: channelId ?? "",
    },
  });
}

export function getFarcasterEmbedCast({
  fid,
  hash,
}: {
  fid: number;
  hash: string;
}) {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/embed-cast`,
    method: "get",
    params: {
      fid,
      hash,
    },
  });
}

export function getFarcasterCastInfo(
  hash: string,
  {
    endFarcasterCursor,
    pageSize,
    withReplies,
  }: {
    endFarcasterCursor?: string;
    pageSize?: number;
    withReplies?: boolean;
  },
): AxiosPromise<
  ApiResp<{
    cast: FarCast;
    comments: { data: FarCast; platform: "farcaster" }[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return request({
    url: `/3r-farcaster/cast/${hash}`,
    method: "get",
    params: {
      endFarcasterCursor,
      pageSize,
      ...(withReplies === false ? { withReplies } : {}),
    },
  });
}

export function getFarcasterCastComments(
  hash: string,
  params: {
    pageSize?: number;
    pageNumber?: number;
  },
): AxiosPromise<
  ApiResp<{
    casts: { data: FarCast; platform: "farcaster" }[];
    farcasterUserData: FarcasterUserData[];
  }>
> {
  return request({
    url: `/3r-farcaster/casts/${hash}/replies`,
    method: "get",
    params,
  });
}

// TODO:
export function getSearchResult(query: string) {
  return axios({
    // url: `${FARCASTER_API_URL}/topics/searching?query=${query}`,
    url: `https://u3-server-test-3rnbvla4lq-df.a.run.app/topics/searching?query=${query}`,
    method: "get",
  });
}

export function getFarcasterEmbedMetadataV2(urls: string[]): AxiosPromise<
  ApiResp<{
    metadata: (null | FarCastEmbedMetaV2)[];
  }>
> {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/embedv2`,
    method: "get",
    params: {
      urls,
      timeout: 3000,
      maxRedirects: 2,
    },
  });
}

export function postSeenCasts(castHashes: string[]) {
  return request({
    url: `/3r-farcaster/casts/seen`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: castHashes,
  });
}
export function getFarcasterUserStats(fid: string | number): AxiosPromise<
  ApiResp<{
    followerCount: number;
    followingCount: number;
    postCount: number;
  }>
> {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/statics`,
    method: "get",
    params: {
      fid,
    },
  });
}

export function getUserDegenTipAllowance({
  fid,
  address,
}: {
  fid?: string | number;
  address: string;
}) {
  return request({
    url: `/3r-farcaster/degen-tip/allowance?address=${address || ""}&fid=${fid || ""}`,
    method: "get",
  });
}

export function notifyTipApi(data: {
  txHash: string;
  amount: number;
  fromFid: number;
  type: string;
  castHash: string;
}) {
  return axios({
    url: `${FARCASTER_API_URL}/3r-bot/tip/notify`,
    method: "post",
    data,
  });
}

const DEFAULT_PAGE_SIZE = 25;
export function getProfileFeeds({
  pageSize,
  keyword,
  group,
  endFarcasterCursor,
  // endLensCursor,
  // lensProfileId,
  fid,
  platforms,
  // lensAccessToken,
}: {
  pageSize?: number;
  keyword?: string;
  group?: ProfileFeedsGroups;
  endFarcasterCursor?: string;
  // endLensCursor?: string;
  // lensProfileId?: string;
  fid?: string;
  platforms?: SocialPlatform[];
  // lensAccessToken?: string;
}): AxiosPromise<
  ApiResp<{
    data: ProfileFeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: ProfileFeedsPageInfo;
  }>
> {
  return axios({
    url: `${FARCASTER_API_URL}/3r-all/profileFeeds`,
    method: "get",
    params: {
      pageSize: pageSize || DEFAULT_PAGE_SIZE,
      keyword,
      group,
      endFarcasterCursor,
      // endLensCursor,
      // lensProfileId,
      fid,
      platforms,
    },
    // headers: {
    //   'Lens-Access-Token': lensAccessToken ? `Bearer ${lensAccessToken}` : '',
    // },
  });
}
