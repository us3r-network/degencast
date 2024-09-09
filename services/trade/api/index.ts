import { ApiResp } from "~/services/shared/types";
import request, { RequestPromise } from "../../shared/api/request";
import { CurationTokenInfo, TokenWithTradeInfo } from "../types";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { Address } from "viem";

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

export function createToken(
  channelId: string,
  fid: number,
): RequestPromise<ApiResp<AttentionTokenEntity>> {
  return request({
    url: `/topics/channels/${channelId}/attention-tokens`,
    method: "post",
    params: { fid },
    headers: {
      needToken: true,
    },
  });
}

export function curationTokenInfo(
  address: Address,
  tokenID: number,
): RequestPromise<ApiResp<CurationTokenInfo>> {
  return request({
    url: `/topics/casts/curation-token`,
    method: "get",
    params: { address, tokenID },
    headers: {
      needToken: false,
    },
  });
}