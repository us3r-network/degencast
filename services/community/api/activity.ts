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
