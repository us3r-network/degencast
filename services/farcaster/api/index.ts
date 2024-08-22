import axios, { AxiosPromise } from "axios";
import { API_BASE_URL } from "~/constants";
import {
  CommunityEntity,
  CommunityInfo,
} from "~/services/community/types/community";
import request, { RequestPromise } from "~/services/shared/api/request";
import { UserActionData } from "~/services/user/types";
import {
  ApiResp,
  Channel,
  FarCast,
  FarCastEmbedMetaV2,
  SocialPlatform,
} from "../types";
import { NeynarCast } from "../types/neynar";
import { ProposalCast } from "~/services/feeds/api";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

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

export type NaynarChannelCastsFeedData = {
  casts: Array<NeynarCast>;
  pageInfo: NaynarChannelCastsFeedPageInfo;
};
export type NaynarChannelCastsFeedPageInfo = {
  cursor: string;
  hasNextPage: boolean;
};
export function getNaynarChannelCastsFeed({
  cursor,
  limit,
  channelId,
}: {
  cursor: string;
  limit: number;
  channelId: string;
}): RequestPromise<ApiResp<NaynarChannelCastsFeedData>> {
  return request({
    url: `/topics/channels/casts/feed`,
    method: "get",
    headers: {
      needToken: true,
    },
    params: {
      cursor,
      limit,
      channelId: channelId ?? "",
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
    url: `${API_BASE_URL}/3r-farcaster/embed-cast`,
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
    headers: {
      needToken: true,
    },
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
    headers: {
      needToken: true,
    },
    params,
  });
}

export function getSearchResult(query: string) {
  return axios({
    url: `${API_BASE_URL}/topics/searching?query=${query}`,
    method: "get",
  });
}

export function getFarcasterEmbedMetadataV2(urls: string[]): AxiosPromise<
  ApiResp<{
    metadata: (null | FarCastEmbedMetaV2)[];
  }>
> {
  return axios({
    url: `${API_BASE_URL}/3r-farcaster/embedv2`,
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
    url: `${API_BASE_URL}/3r-farcaster/statics`,
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
    url: `${API_BASE_URL}/3r-bot/tip/notify`,
    method: "post",
    data,
  });
}

export function fetchUserRecommendChannels({
  fid,
}: {
  fid: number;
}): AxiosPromise<ApiResp<Channel[]>> {
  return request({
    url: `/topics/recommendaton/channels?fid=${fid || ""}`,
    method: "get",
  });
}

export function getCastImageUrl(castHash: string) {
  return `${API_BASE_URL}/3r-farcaster/cast-image?castHash=${castHash}`;
}

export function fetchUserHostChannels({
  fid,
}: {
  fid: number;
}): AxiosPromise<ApiResp<{ id: string; name: string; imageUrl: string }[]>> {
  return request({
    url: `/topics/host-channels?fid=${fid}`,
    method: "get",
  });
}

export type CastDetailsData = ProposalCast & {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
};
export function getCastDetails(
  hash: string,
): RequestPromise<ApiResp<CastDetailsData>> {
  return request({
    url: `/topics/casts/${hash}/detail`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export type CastReplies = {
  limit?: number;
  cursor?: string;
};
export type CastRepliesData = {
  casts: Array<
    ProposalCast & {
      channel: CommunityEntity;
      tokenInfo: AttentionTokenEntity;
    }
  >;
  next: {
    cursor: string;
  };
};
export function getCastReplies(
  castHash: string,
  params: CastReplies,
): RequestPromise<ApiResp<CastRepliesData>> {
  return request({
    url: `/topics/casts/${castHash}/replies`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
