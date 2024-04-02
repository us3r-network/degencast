import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";
import { LoginRespEntity, MyWalletTokensRespEntity } from "../types";

export function login(): RequestPromise<
  ApiResp<LoginRespEntity>
> {
  return request({
    url: `degencast-users/login`,
    method: "post",    
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