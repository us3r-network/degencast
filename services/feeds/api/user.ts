import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { ProposalCast } from ".";

export type UserCastsRespParams = {
  fid: number;
  viewer_fid?: number;
  limit?: number;
  cursor?: string;
};
export function getUserCasts(
  params: UserCastsRespParams,
): RequestPromise<ApiResp<UserCastsData>> {
  return request({
    url: `/topics/channels/mycasts`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type UserCurationCastsParams = {
  fid: number;
  viewer_fid?: number;
  pageSize?: number;
  pageNumber?: number;
};
export function getUserCurationCasts(
  params: UserCurationCastsParams,
): RequestPromise<ApiResp<Array<CastData>>> {
  return request({
    url: `/topics/channels/curator/casts`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type UserCastsData = {
  casts: Array<CastData>;
  next: {
    cursor: string;
  };
};

export type CastData = ProposalCast & {
  channel: CommunityEntity;
  tokenInfo: AttentionTokenEntity;
};
