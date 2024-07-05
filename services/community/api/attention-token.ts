import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { AttentionTokenEntity } from "../types/attention-token";

export type ChannelAttentionTokenParams = {
  channelId: string;
};
export function getChannelAttentionToken({
  channelId,
}: ChannelAttentionTokenParams): RequestPromise<ApiResp<AttentionTokenEntity>> {
  return request({
    url: `/topics/channels/${channelId}/attention-tokens`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
