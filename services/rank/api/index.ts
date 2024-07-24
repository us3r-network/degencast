import { Channel } from "~/services/farcaster/types";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { CommunityRankOrderBy, TokenRankOrderBy } from "../types";

type RankParams = {
    orderBy: CommunityRankOrderBy | TokenRankOrderBy;
    order: "ASC" | "DESC";
    pageSize?: number;
    pageNumber?: number;
  };
  
  export function fetchRankCommunities(
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