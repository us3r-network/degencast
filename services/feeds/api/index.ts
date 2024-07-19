import { CommunityEntity } from "~/services/community/types/community";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { mockChannels } from "../mocks/channels";
import { mockCasts } from "../mocks/casts";
import { mockAttentionToken } from "../mocks/attention-token";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "../types/proposal";
import { mockProposals } from "../mocks/proposal";

const mockChannelsFeedRequest = async ({
  pageSize,
  pageNumber,
}: ExploreSelectionFeeds) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockChannelsData = mockChannels
    .concat(mockChannels)
    .concat(mockChannels)
    .concat(mockChannels)
    .concat(mockChannels);
  return {
    data: {
      code: 0,
      msg: "",
      data: mockChannelsData.map((channel, idx) => ({
        channel:
          idx > mockProposals.length && idx % 4 > 0 ? undefined : channel,
        tokenInfo: mockAttentionToken,
        casts:
          idx > 0 && idx % 2 > 0
            ? []
            : mockProposals.map((proposal) => ({
                proposal,
                cast: mockCasts[0],
              })),
      })),
    },
  } as unknown as RequestPromise<ApiResp<ExploreSelectionFeedsData>>;
};

const mockCastsFeedRequest = async ({
  pageSize,
  pageNumber,
}: ExploreSelectionFeeds) => {
  mockCasts;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      code: 0,
      msg: "",
      data: [...mockProposals, mockProposals[0]].map((proposal, idx) => ({
        channel: idx === mockProposals.length - 1 ? undefined : mockChannels[0],
        tokenInfo: mockAttentionToken,
        proposal,
        cast: mockCasts[0],
      })),
    },
  } as unknown as RequestPromise<ApiResp<ExploreCastFeedsData>>;
};

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
  return mockChannelsFeedRequest(params);
  //   return request({
  //     url: `/topics/channels/feed/selection`,
  //     method: "get",
  //     params,
  //     headers: {
  //       needToken: true,
  //     },
  //   });
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
  return mockChannelsFeedRequest(params);
  //   return request({
  //     url: `/topics/channels/feed/proposal`,
  //     method: "get",
  //     params,
  //     headers: {
  //       needToken: true,
  //     },
  //   });
}

export type ExploreCastFeeds = {
  pageSize?: number;
  pageNumber?: number;
};
export type ExploreCastFeedsData = Array<
  ProposalCast & {
    channel: CommunityEntity;
    tokenInfo: AttentionTokenEntity;
  }
>;
export function getExploreCastFeeds(
  params: ExploreCastFeeds,
): RequestPromise<ApiResp<ExploreCastFeedsData>> {
  return mockCastsFeedRequest(params);
  //   return request({
  //     url: `/topics/channels/feed/cast`,
  //     method: "get",
  //     params,
  //     headers: {
  //       needToken: true,
  //     },
  //   });
}
