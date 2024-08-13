import { ApiResp } from "~/services/shared/types";
import request, { RequestPromise } from "../../shared/api/request";
import {
  TokenWithTradeInfo
} from "../types";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

export function communityTokens(): RequestPromise<
  ApiResp<TokenWithTradeInfo[]>
> {
  return request({
    url: `topics/trade-tokens`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
export function createToken(channelId:string): RequestPromise<
  ApiResp<AttentionTokenEntity>
> {
  return request({
    url: `/topics/channels/${channelId}/attention-tokens`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}