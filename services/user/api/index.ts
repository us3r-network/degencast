import { ApiResp } from "~/services/shared/types";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import request, { RequestPromise } from "../../shared/api/request";
import {
  InvitationCodeRespEntity,
  LoginRespEntity,
  TipsInfo,
  UserActionData,
  UserActionPointConfig,
} from "../types";
import { mockMyNFTs } from "../mocks/mynfts";
import { Buffer } from "buffer";

export function getMyDegencast(): RequestPromise<ApiResp<LoginRespEntity>> {
  return request({
    url: `degencast-users/me`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export function getMyInvitationCodes(): RequestPromise<
  ApiResp<Array<InvitationCodeRespEntity>>
> {
  return request({
    url: `degencast-users/my-invitation-codes`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export function loginDegencast(params?: {
  inviterFid?: string | number;
  inviteCode?: string;
}): RequestPromise<ApiResp<LoginRespEntity>> {
  const { inviterFid, inviteCode } = params || {};
  return request({
    url: `degencast-users/login`,
    method: "post",
    params: {
      ...(inviterFid ? { inviterFid } : {}),
      ...(inviteCode ? { inviterCode: inviteCode } : {}),
    },
    headers: {
      needToken: true,
    },
  });
}

export function postUserActions(actions: UserActionData[], hmac: string) {
  const hmacBase64 = Buffer.from(hmac).toString("base64");
  return request({
    url: `/degencast-users/actions`,
    method: "post",
    headers: {
      needToken: true,
      "X-HMAC-SIGNATURE": hmacBase64,
    },
    data: actions,
  });
}

export function getCastUserActions(
  castHash: string,
): RequestPromise<ApiResp<Array<UserActionData>>> {
  return request({
    url: `/topics/casts/${castHash}/actions`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export function getActionPointConfig(): RequestPromise<
  ApiResp<UserActionPointConfig>
> {
  return request({
    url: `/topics/action-point-configs`,
    method: "get",
  });
}

export function getUserPoints(): RequestPromise<ApiResp<{ value: number }>> {
  return request({
    url: `/degencast-users/points`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export function myTokens(
  pubkey: `0x${string}`,
): RequestPromise<ApiResp<TokenWithTradeInfo[]>> {
  return request({
    url: `topics/my-tokens`,
    method: "get",
    params: {
      pubkey,
    },
    headers: {
      needToken: true,
    },
  });
}

const mockMyNFTRequest = async ({ pubkey }: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      code: 0,
      msg: "",
      data: mockMyNFTs,
    },
  } as unknown as RequestPromise<ApiResp<ERC42069Token[]>>;
};

export function myNFTs(
  pubkey: `0x${string}`,
): RequestPromise<ApiResp<ERC42069Token[]>> {
  // return mockMyNFTRequest(pubkey);
  return request({
    url: `topics/my-nfts`,
    method: "get",
    params: {
      pubkey,
    },
    headers: {
      needToken: true,
    },
  });
}

export function myTips(): RequestPromise<ApiResp<TipsInfo[]>> {
  return request({
    url: `topics/my-tips`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
