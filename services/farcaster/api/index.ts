import axios from "axios";
import { FARCASTER_API_URL } from "~/constants";
import { RequestPromise } from "~/services/shared/api/request";
import { ApiResp } from "../types";

export type FarcasterPageInfo = {
  endTimestamp: number;
  endCursor: string;
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};

export function getFarcasterTrending({
  start,
  end,
  least,
  channelId,
}: {
  start: number;
  end: number;
  least?: number;
  channelId?: string;
}): RequestPromise<ApiResp<any>> {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/trending`,
    method: "get",
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
      channelId: channelId ?? "",
    },
  });
}
