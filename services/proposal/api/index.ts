import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";

export function proxyUserToCreateProposal({
  castHash,
  curatorAddr,
}: {
  castHash: string;
  curatorAddr: string;
}): RequestPromise<ApiResp<any>> {
  return request({
    url: `/topics/proposals`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: {
      castHash,
      curatorAddr,
    },
  });
}
