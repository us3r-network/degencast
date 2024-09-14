import { CommunityEntity } from "~/services/community/types/community";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "../types/proposal";

export type ProposalCast = {
  cast: NeynarCast;
  proposal: ProposalEntity;
};

export type ExploreSelectionFeeds = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreSelectionFeedsData = Array<{
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  casts: ProposalCast[];
}>;
export function getExploreSelectionFeeds(
  params: ExploreSelectionFeeds,
): RequestPromise<ApiResp<ExploreSelectionFeedsData>> {
  // return mockChannelsFeedRequest(params);
  return request({
    url: `/topics/channels/feed/selection`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ExploreProposalFeeds = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreProposalFeedsData = Array<{
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
  casts: ProposalCast[];
}>;
export function getExploreProposalFeeds(
  params: ExploreProposalFeeds,
): RequestPromise<ApiResp<ExploreProposalFeedsData>> {
  // return mockChannelsFeedRequest(params);
  return request({
    url: `/topics/channels/feed/proposal`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ExploreCastFeeds = {
  limit?: number;
  cursor?: string;
};
export type ExploreCastFeedsData = {
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
export function getExploreCastFeeds(
  params: ExploreCastFeeds,
): RequestPromise<ApiResp<ExploreCastFeedsData>> {
  // return mockCastsFeedRequest(params);
  return request({
    url: `/topics/channels/feed/cast`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
