import axios from "axios";
import { API_BASE_URL } from "~/constants";

export function postFrameActionApi(data: any) {
  return axios({
    url: `${API_BASE_URL}/3r-farcaster/frame-action/proxy`,
    method: "post",
    data,
  });
}

export function postFrameActionRedirectApi(data: any) {
  return axios({
    url: `${API_BASE_URL}/3r-farcaster/frame-action-redirect/proxy`,
    method: "post",
    data,
  });
}

export function postFrameActionTxApi(data: any) {
  return axios({
    url: `${API_BASE_URL}/3r-farcaster/frame-action-tx/proxy`,
    method: "post",
    data,
  });
}
