import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";

export type CommunitySharesParams = {
  pageSize?: number;
  pageNumber?: number;
  channelId: string;
};
export type CommunityMemberShare = {
  username: string;
  displayName: string;
  evmAddress: string;
  pfp: string;
  sharesAmount: number;
};
export type CommunitySharesData = Array<CommunityMemberShare>;
export function fetchCommunityShares(
  params: CommunitySharesParams,
): RequestPromise<ApiResp<CommunitySharesData>> {
  return request({
    url: `/topics/shares`,
    method: "get",
    params,
  });
}

export function fetchCommunityShareInfos(params: {
  channelId: string;
}): RequestPromise<
  ApiResp<{
    holders: number;
    supply: number;
  }>
> {
  return request({
    url: `/topics/share-infos`,
    method: "get",
    params,
  });
}
