import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";
import {
  LoginRespEntity,
  MyWalletTokensRespEntity,
  UserActionPointConfig,
} from "../types";

export function login(): RequestPromise<ApiResp<LoginRespEntity>> {
  return request({
    url: `degencast-users/login`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}

export function postUserActions(actions: any[]) {
  return request({
    url: `/degencast-users/actions`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: actions,
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

export function myTokens(): RequestPromise<
  ApiResp<MyWalletTokensRespEntity[]>
> {
  return request({
    url: `topics/my-tokens`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}
