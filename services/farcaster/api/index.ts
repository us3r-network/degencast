import axios, { AxiosPromise } from "axios";
import { FARCASTER_API_URL } from "~/constants";
import request, { RequestPromise } from "~/services/shared/api/request";
import { ApiResp, FarCastEmbedMetaV2, SocialPlatform } from "../types";
import { CommunityEntity } from "~/services/community/types/community";

export type FarcasterPageInfo = {
  startIndex: number;
  endIndex: number;
  endFarcasterCursor: number;
  hasNextPage: boolean;
};

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};
export type TrendingCastData = {
  community: CommunityEntity;
  data: any;
  platform: SocialPlatform;
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
}): RequestPromise<
  ApiResp<{
    casts: Array<TrendingCastData>;
    farcasterUserData: Array<FarcasterUserData>;
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${FARCASTER_API_URL}/topics/casts/trending`,
    method: "get",
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
      channelId: channelId ?? "",
    },
  });
}

export function getFarcasterEmbedCast({
  fid,
  hash,
}: {
  fid: number;
  hash: string;
}) {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/embed-cast`,
    method: "get",
    params: {
      fid,
      hash,
    },
  });
}

// TODO:
export function getSearchResult(query: string) {
  return axios({
    // url: `${FARCASTER_API_URL}/topics/searching?query=${query}`,
    url: `https://u3-server-test-3rnbvla4lq-df.a.run.app/topics/searching?query=${query}`,
    method: "get",
  });
}

export function getFarcasterEmbedMetadataV2(urls: string[]): AxiosPromise<
  ApiResp<{
    metadata: (null | FarCastEmbedMetaV2)[];
  }>
> {
  return axios({
    url: `${FARCASTER_API_URL}/3r-farcaster/embedv2`,
    method: "get",
    params: {
      urls,
      timeout: 3000,
      maxRedirects: 2,
    },
  });
}

export function postSeenCasts(castHashes: string[]) {
  return request({
    url: `/3r-farcaster/casts/seen`,
    method: "post",
    headers: {
      needToken: true,
    },
    data: castHashes,
  });
}
