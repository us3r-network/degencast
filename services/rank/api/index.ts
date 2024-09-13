import { Channel } from "~/services/farcaster/types";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { CuratorEntity, RankOrderBy } from "../types";

type RankParams = {
  orderBy?: RankOrderBy;
  order: "ASC" | "DESC";
  pageSize?: number;
  pageNumber?: number;
};

export function fetchRankChannels(
  params: RankParams,
): RequestPromise<ApiResp<Channel[]>> {
  return request({
    url: `/topics/channels/rank`,
    method: "get",
    params,
  });
}

export function fetchRankTokens(
  params: RankParams,
): RequestPromise<ApiResp<Channel[]>> {
  return request({
    url: `/topics/channels/rank`,
    method: "get",
    params,
  });
}

export function fetchRankCurators(
  params: RankParams,
  channelId?: string,
): RequestPromise<ApiResp<CuratorEntity[]>> {
  return request({
    url: `/topics/channels/curators`,
    method: "get",
    params: {
      ...params,
      channelId: channelId || "",
    },
  });
}
