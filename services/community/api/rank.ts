import { Channel } from "~/services/farcaster/types";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { CommunityRankOrderBy } from "../types/rank";

type RankCommunitiesParams = {
    orderBy: CommunityRankOrderBy;
    order: "ASC" | "DESC";
    pageSize?: number;
    pageNumber?: number;
  };
  
  export function fetchRankCommunities(
    params: RankCommunitiesParams,
  ): RequestPromise<ApiResp<Channel[]>> {
    return request({
      url: `/topics/channels/rank`,
      method: "get",
      params,
    });
  }