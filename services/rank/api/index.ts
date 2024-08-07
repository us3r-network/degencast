import { Channel } from "~/services/farcaster/types";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { CuratorEntity, RankOrderBy } from "../types";
import { mockCurators } from "../mocks/curators";

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

const mockCuratorsRequest = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      code: 0,
      msg: "",
      data: mockCurators,
    },
  } as unknown as RequestPromise<ApiResp<CuratorEntity[]>>;
};

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
