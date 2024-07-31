import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { ActivityEntity, ActivitiesParams } from "../types/activity";
import { Address } from "viem";
import { ERC42069Token } from "~/services/trade/types";

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

export function getTokenActivities(
  params: ActivitiesParams,
  token: ERC42069Token,
): RequestPromise<ApiResp<Array<ActivityEntity>>> {
  return request({
    url: `/topics/channels/nfts/onchain`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
