import { ApiResp } from "~/services/shared/types";
import request, { RequestPromise } from "../../shared/api/request";
import {
  CreateTokenResp,
  TokenWithTradeInfo
} from "../types";

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
  ApiResp<CreateTokenResp>
> {
  return request({
    url: `/topics/channels/${channelId}/attention-tokens`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}