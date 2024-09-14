import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "../types/proposal";
import { getExploreCastFeeds } from ".";

export type ProposalCast = {
  cast: NeynarCast;
  proposal: ProposalEntity;
};

export type ChannelSelectionFeedsParams = {
  channelId: string;
  pageSize?: number;
  pageNumber?: number;
};
export type ChannelSelectionFeedsData = Array<ProposalCast>;
export function getChannelSelectionFeeds({
  channelId,
  ...params
}: ChannelSelectionFeedsParams): RequestPromise<
  ApiResp<ChannelSelectionFeedsData>
> {
  // return mockFeedRequest(params);
  return request({
    url: `/topics/channels/${channelId}/feed/selection`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ChannelProposalFeedsParams = {
  channelId: string;
  pageSize?: number;
  pageNumber?: number;
};
export type ChannelProposalFeedsData = Array<ProposalCast>;
export function getChannelProposalFeeds({
  channelId,
  ...params
}: ChannelProposalFeedsParams): RequestPromise<
  ApiResp<ChannelProposalFeedsData>
> {
  // return mockFeedRequest(params);
  return request({
    url: `/topics/channels/${channelId}/feed/proposal`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type ChannelCastFeedsParams = {
  channelId: string;
  limit?: number;
  cursor?: string;
  pageNumber?: number;
};
export type ChannelCastFeedsData = {
  casts: Array<ProposalCast>;
  next: {
    cursor: string;
  };
};
export function getChannelCastFeeds({
  channelId,
  ...params
}: ChannelCastFeedsParams): RequestPromise<ApiResp<ChannelCastFeedsData>> {
  // return mockCastsFeedRequest(params);
  if (channelId === "home") return getExploreCastFeeds(params);
  return request({
    url: `/topics/channels/${channelId}/feed/cast`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
