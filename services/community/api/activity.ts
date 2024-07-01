import request, { RequestPromise } from "~/services/shared/api/request";
import { ActivityEntity } from "../types/activity";
import { ApiResp } from "~/services/shared/types";

export type OnchainActivitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  channelId?: string;
  type?: string;
};
export type OnchainActivitiesData = Array<ActivityEntity>;
export function getOnchainActivities(
  params: OnchainActivitiesParams,
): RequestPromise<ApiResp<OnchainActivitiesData>> {
  return request({
    url: `/topics/channels/onchain`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}
