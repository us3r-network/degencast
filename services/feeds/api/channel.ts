import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { mockCasts } from "../mocks/casts";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "../types/proposal";
import { mockProposals } from "../mocks/proposal";

const mockFeedRequest = async (props: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    data: {
      code: 0,
      msg: "",
      data: [
        ...mockProposals,
        mockProposals[mockProposals.length - 1],
        mockProposals[mockProposals.length - 1],
        mockProposals[mockProposals.length - 1],
      ].map((proposal, idx) => ({
        proposal,
        cast: mockCasts[
          idx > mockCasts.length - 1 ? mockCasts.length - 1 : idx
        ],
      })),
    },
  } as unknown as RequestPromise<ApiResp<ChannelSelectionFeedsData>>;
};

const mockCastsFeedRequest = async ({ limit, cursor }: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      code: 0,
      msg: "",
      data: {
        casts: [
          ...mockProposals,
          mockProposals[mockProposals.length - 1],
          mockProposals[mockProposals.length - 1],
          mockProposals[mockProposals.length - 1],
        ].map((proposal, idx) => ({
          proposal,
          cast: mockCasts[Number(cursor)],
        })),
        next: {
          cursor: Number(cursor) + 1,
        },
      },
    },
  } as unknown as RequestPromise<ApiResp<ChannelCastFeedsData>>;
};

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
  return request({
    url: `/topics/channels/${channelId}/feed/cast`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
