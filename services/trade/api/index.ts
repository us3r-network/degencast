import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";
import {
  TokenWithTradeInfo,
  ShareInfo,
  CreateTokenResp,
  // TipsInfo,
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
export function communityShares(): RequestPromise<
  ApiResp<ShareInfo[]>
> {
  return request({
    url: `topics/trade-shares`,
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
// export function communityTips(): RequestPromise<
//   ApiResp<TipsInfo[]>
// > {
//   return request({
//     url: `topics/trade-tips`,
//     method: "get",
//     headers: {
//       needToken: true,
//     },
//   });
// }