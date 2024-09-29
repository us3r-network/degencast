import {
  CommunityEntity,
  CommunityStatistics,
  CommunityTypeEntity,
  MemberEntity,
} from "../types/community";
import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { Author, NeynarCast } from "~/services/farcaster/types/neynar";
import { PriceChangePercentage } from "../types/trade";

export type CommunityTypesData = Array<CommunityTypeEntity>;
export function fetchCommunityTypes(): RequestPromise<
  ApiResp<CommunityTypesData>
> {
  return request({
    url: `/topics/community-types`,
    method: "get",
  });
}

export type TrendingCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type TrendingCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchTrendingCommunities(
  params: TrendingCommunitiesParams,
): RequestPromise<ApiResp<TrendingCommunitiesData>> {
  return request({
    url: `/topics/trending`,
    method: "get",
    params,
  });
}

export type NewestCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type NewestCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchNewestCommunities(
  params: NewestCommunitiesParams,
): RequestPromise<ApiResp<NewestCommunitiesData>> {
  return request({
    url: `/topics/newest`,
    method: "get",
    params,
  });
}

export type JoinedCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type JoinedCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchJoinedCommunities(
  params: JoinedCommunitiesParams,
): RequestPromise<ApiResp<JoinedCommunitiesData>> {
  return request({
    url: `/topics/joined`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type GrowingCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type GrowingCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchGrowingCommunities(
  params: GrowingCommunitiesParams,
): RequestPromise<ApiResp<GrowingCommunitiesData>> {
  return request({
    url: `/topics/trending`,
    method: "get",
    params,
  });
}

export type JoiningCommunityData = null;
export function fetchJoiningCommunity(
  topicId: string | number,
): RequestPromise<ApiResp<JoiningCommunityData>> {
  return request({
    url: `/topics/${topicId}/joining`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}

export type UnjoiningCommunityData = null;
export function fetchUnjoiningCommunity(
  topicId: string | number,
): RequestPromise<ApiResp<UnjoiningCommunityData>> {
  return request({
    url: `/topics/${topicId}/unjoining`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}

export type JoiningChannelData = null;
export function fetchJoiningChannel(
  channelId: string | number,
  warpcastAuthToken?: string,
): RequestPromise<ApiResp<JoiningChannelData>> {
  return request({
    url: `/topics/channels/${channelId}/joining`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: {
      warpcastAuthToken,
    }
  });
}

export type UnjoiningChannelData = null;
export function fetchUnjoiningChannel(
  channelId: string | number,
  warpcastAuthToken?: string,
): RequestPromise<ApiResp<UnjoiningChannelData>> {
  return request({
    url: `/topics/channels/${channelId}/unjoining`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: {
      warpcastAuthToken,
    }
  });
}

export type CommunityData = CommunityEntity & CommunityStatistics;
export function fetchCommunity(
  id: string | number,
): RequestPromise<ApiResp<CommunityData>> {
  return request({
    url: `/topics/channel?id=${id}`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export type CommunityMembersParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type CommunityMembersData = {
  members: Array<MemberEntity>;
  totalNum: number;
};
export function fetchCommunityMembers(
  id: string | number,
  params: CommunityMembersParams,
): RequestPromise<ApiResp<CommunityMembersData>> {
  return request({
    url: `/topics/${id}/members`,
    method: "get",
    params,
  });
}

export type WarpcastChannel = {
  id: string;
  url: string;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: number;
  leadFid: number;
  moderatorFid: number;
  followerCount: number;
  tokenSymbol?: string;
};
export function fetchWarpcastChannels(): RequestPromise<
  ApiResp<WarpcastChannel[]>
> {
  return request({
    url: `/topics/warpcast-channels`,
    method: "get",
  });
}

export type CoverChannelsParams = {
  pageSize?: number;
  pageNumber?: number;
};
export type CoverChannelsData = Array<{
  id: string;
  url: string;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: number;
  leadFid: number;
  hostFids: number[];
  followerCount: number;
  tokenSymbol?: string;
  tokenPriceChangePercentag?: PriceChangePercentage;
}>;
export function fetchCoverChannels(
  params: CoverChannelsParams,
): RequestPromise<ApiResp<CoverChannelsData>> {
  return request({
    url: `/topics/channels/trending`,
    method: "get",
    params,
  });
}

export type ExploreTrendingChannels = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreTrendingChannelsData = Array<
  CommunityEntity &
  CommunityStatistics & {
    hosts: Array<Author>;
    cast?: NeynarCast | null;
  }
>;
export function getExploreTrendingChannels(
  params: ExploreTrendingChannels,
): RequestPromise<ApiResp<ExploreTrendingChannelsData>> {
  return request({
    url: `/topics/channels/discover`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ExploreFollowingChannels = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreFollowingChannelsData = Array<
  CommunityEntity &
  CommunityStatistics & {
    hosts: Array<Author>;
    cast?: NeynarCast | null;
  }
>;
export function getExploreFollowingChannels(
  params: ExploreFollowingChannels,
): RequestPromise<ApiResp<ExploreFollowingChannelsData>> {
  return request({
    url: `/topics/channels/following`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ExploreHostingChannels = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreHostingChannelsData = Array<
  CommunityEntity &
  CommunityStatistics & {
    hosts: Array<Author>;
    cast?: NeynarCast | null;
  }
>;
export function getExploreHostingChannels(
  params: ExploreHostingChannels,
): RequestPromise<ApiResp<ExploreHostingChannelsData>> {
  return request({
    url: `/topics/channels/hosting`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type DegencastChannel = {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
};
export function createDegencastChannel(
  params: DegencastChannel,
): RequestPromise<ApiResp<any>> {
  return request({
    url: `/topics/channels`,
    method: "post",
    data: params,
    headers: {
      needToken: true,
    },
  });
}
