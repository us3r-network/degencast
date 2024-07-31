import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { ActivityEntity, ActivitiesParams } from "../types/activity";

export function getActivities(
  params: ActivitiesParams,
): RequestPromise<ApiResp<Array<ActivityEntity>>> {
  return request({
    url: `/topics/channels/onchain`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export function getChannelActivities(
  params: ActivitiesParams,
  channelId: string,
): RequestPromise<ApiResp<Array<ActivityEntity>>> {
  return request({
    url: `/topics/channels/${channelId}/onchain`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export function getCastActivities(
  params: ActivitiesParams,
  castHash: string,
): RequestPromise<ApiResp<Array<ActivityEntity>>> {
  return request({
    url: `/topics/casts/${castHash}/onchain`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
