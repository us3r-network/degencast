import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";

export function login(): RequestPromise<
  ApiResp<unknown>
> {
  return request({
    url: `degencast-users/login`,
    method: "post",    
    headers: {
      needToken: true,
    },
  });
}
