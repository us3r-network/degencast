import request, { RequestPromise } from "~/services/shared/api/request";
import { ActivityEntity } from "../types/activity";
import { ApiResp } from "~/services/shared/types";

export type ChannelAttentionTokenParams = {
  channelId: string;
};
export type ChannelAttentionTokenData = Array<ActivityEntity>;
export function getChannelAttentionToken({
  channelId,
}: ChannelAttentionTokenParams): RequestPromise<
  ApiResp<ChannelAttentionTokenData>
> {
  return request({
    url: `/topics/channels/${channelId}/attention-tokens`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
