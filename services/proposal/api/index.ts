import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";

export function proxyUserToCreateProposal({
  castHash,
}: {
  castHash: string;
}): RequestPromise<
  ApiResp<
    AttentionTokenEntity & {
      tokenId: number;
    }
  >
> {
  return request({
    url: `/topics/proposals`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: {
      castHash,
    },
  });
}
