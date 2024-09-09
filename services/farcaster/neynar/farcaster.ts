import axios from "axios";
import {
  ConversationCast,
  NeynarCast,
  NeynarCastsResp,
  NeynarChannelsResp,
} from "../types/neynar";
import { NEYNAR_API_HOST, FARCASTER_HUB_URL } from "~/constants/farcaster";

export async function fetchCastWithHash({
  hash,
  viewer_fid,
}: {
  hash: string;
  viewer_fid?: number;
}): Promise<{ cast: NeynarCast }> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/cast?identifier=${hash}&type=hash&viewer_fid=${viewer_fid || ""}`,
    method: "get",
  });

  console.log("fetchCastWithHash", resp.data);
  return resp.data;
}

export async function fetchCastConversationWithHash({
  hash,
  viewer_fid,
  reply_depth = 1,
}: {
  hash: string;
  viewer_fid?: number;
  reply_depth?: number;
}): Promise<{
  conversation: {
    cast: ConversationCast;
  };
}> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/cast/conversation?identifier=${hash}&type=hash&reply_depth=${reply_depth}&include_chronological_parent_casts=false&viewer_fid=${viewer_fid || ""}`,
    method: "get",
  });

  console.log("fetchCastWithHash", resp.data);
  return resp.data;
}

export async function fetchCastWithHashFid({
  hash,
  fid,
}: {
  hash: string;
  fid: string;
}) {
  const resp = await axios({
    url: `${FARCASTER_HUB_URL}/v1/castById?fid=${fid}&hash=${hash}`,
    method: "get",
  });

  console.log("fetchCastWithHashFid", resp.data);
  return resp.data;
}

export async function fetchUserFollowingChannels({
  fid,
  limit,
  cursor,
}: {
  fid: number;
  limit: number;
  cursor?: string | null;
}): Promise<NeynarChannelsResp> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/user/channels?fid=${fid}&limit=${limit}&cursor=${cursor || ""}`,
    method: "get",
  });
  // console.log("Retrieve all channels that a given fid follows", resp.data);
  return resp.data;
}

export async function fetchUserActiveChannels({
  fid,
  limit,
  cursor,
}: {
  fid: number;
  limit: number;
  cursor?: string | null;
}): Promise<NeynarChannelsResp> {
  const resp = await axios({
    url: `${NEYNAR_API_HOST}/v2/farcaster/channel/user?fid=${fid}&limit=${limit}&cursor=${cursor || ""}`,
    method: "get",
  });
  // console.log("Retrieve all channels that a given fid active", resp.data);
  return resp.data;
}

export async function fetchUserBulk({
  fids,
  viewer_fid,
}: {
  fids: number[];
  viewer_fid?: number;
}) {
  const url =
    `${NEYNAR_API_HOST}/v2/farcaster/user/bulk?fids=${fids.join(",")}` +
    (viewer_fid ? `&viewer_fid=${viewer_fid}` : "");
  const resp = await axios({
    url,
    method: "get",
  });
  return resp.data;
}

export async function fetchUserCasts({
  fids,
  limit,
  cursor,
  viewer_fid,
}: {
  fids: number[];
  limit: number;
  cursor?: string | null;
  viewer_fid?: number;
}): Promise<NeynarCastsResp> {
  const url =
    `${NEYNAR_API_HOST}/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${fids.join(",")}&limit=${limit}&cursor=${cursor || ""}` +
    (viewer_fid ? `&viewer_fid=${viewer_fid}` : "");
  const resp = await axios({
    url,
    method: "get",
  });
  return resp.data;
}
