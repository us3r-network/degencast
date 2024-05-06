import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";

export type CommunityTipsRankParams = {
  pageSize?: number;
  pageNumber?: number;
  channelId: string;
};

export type CommunityMemberTipsRank = {
  username: string;
  displayName: string;
  evmAddress: string;
  pfp: string;
  tipsAmount: number;
};

export type CommunityTipsRankData = Array<CommunityMemberTipsRank>;
export function fetchCommunityTipsRank(
  params: CommunityTipsRankParams,
): RequestPromise<ApiResp<CommunityTipsRankData>> {
  return request({
    url: `/topics/tips`,
    method: "get",
    params,
  });
}
